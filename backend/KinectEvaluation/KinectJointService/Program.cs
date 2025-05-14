using Microsoft.Azure.Kinect.Sensor;
using Microsoft.Azure.Kinect.BodyTracking;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using System;
using System.IO;
using System.Threading.Tasks;
using System.Runtime.InteropServices;
using System.Drawing;
using System.Drawing.Imaging;
using Microsoft.AspNetCore.Http;
using System.Collections.Generic;
using KinectJointService.Services;
using System.Linq;
using System.Numerics;


var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

app.UseSwagger();
app.UseSwaggerUI();

app.MapGet("/api/joints/live", () =>
{
    using var capture = KinectService.Device.GetCapture();
    KinectService.Tracker.EnqueueCapture(capture);
    using var frame = KinectService.Tracker.PopResult();

    if (frame == null || frame.NumberOfBodies == 0)
        return Results.NotFound("No bodies detected");

    var skeleton = frame.GetBody(0).Skeleton;
    var joints = new Dictionary<string, object>();

    foreach (JointId id in Enum.GetValues(typeof(JointId)).Cast<JointId>().Where(j => j != JointId.Count))
    {
        var joint = skeleton.GetJoint(id);
        joints[id.ToString()] = new
        {
            X = joint.Position.X / 1000.0,
            Y = joint.Position.Y / 1000.0,
            Z = joint.Position.Z / 1000.0
        };
    }


    return Results.Ok(joints);
});

app.MapGet("/api/joints/render", () =>
{
    using var capture = KinectService.Device.GetCapture();
    KinectService.Tracker.EnqueueCapture(capture);
    using var frame = KinectService.Tracker.PopResult();

    if (frame == null || frame.NumberOfBodies == 0)
        return Results.NotFound("No bodies detected");

    var skeleton = frame.GetBody(0).Skeleton;
    var color = capture.Color;
    int width = color.WidthPixels;
    int height = color.HeightPixels;
    byte[] raw = new byte[color.Size];
    #nullable enable
    unsafe
    {
        using (var memoryHandle = color.Memory.Pin())
        {
            byte* pointer = (byte*)memoryHandle.Pointer; // Use unsafe context for pointer operations
            Marshal.Copy((IntPtr)pointer, raw, 0, raw.Length);
        }
    }

    using var bitmap = new Bitmap(width, height, PixelFormat.Format32bppArgb);
    var bmpData = bitmap.LockBits(new Rectangle(0, 0, width, height), ImageLockMode.WriteOnly, bitmap.PixelFormat);
    Marshal.Copy(raw, 0, bmpData.Scan0, raw.Length);
    bitmap.UnlockBits(bmpData);

    using var g = Graphics.FromImage(bitmap);
    using var jointBrush = new SolidBrush(Color.Orange);
    using var bonePen = new Pen(Color.Orange, 3);

    var calibration = KinectService.Device.GetCalibration();

    PointF GetJointPoint(Joint joint)
    {
        var position3D = new Vector3
        {
            X = joint.Position.X,
            Y = joint.Position.Y,
            Z = joint.Position.Z
        };

        var point2D = calibration.TransformTo2D(
            position3D,
            CalibrationDeviceType.Depth,
            CalibrationDeviceType.Color
        );

        if (point2D.HasValue)
            return new PointF(point2D.Value.X, point2D.Value.Y);
        else
            return new PointF(-100, -100); // fuera de campo visible
    }

    void DrawBone(JointId j1, JointId j2)
    {
        var p1 = GetJointPoint(skeleton.GetJoint(j1));
        var p2 = GetJointPoint(skeleton.GetJoint(j2));

        if (p1.X >= 0 && p2.X >= 0)
            g.DrawLine(bonePen, p1, p2);
    }

    void DrawJoint(JointId id)
    {
        var p = GetJointPoint(skeleton.GetJoint(id));
        if (p.X >= 0)
            g.FillEllipse(jointBrush, p.X - 4, p.Y - 4, 8, 8);
    }

    JointId[,] bones = new JointId[,]
    {
        { JointId.Head, JointId.Neck },
        { JointId.Neck, JointId.SpineChest },
        { JointId.SpineChest, JointId.SpineNavel },
        { JointId.SpineNavel, JointId.Pelvis },
        { JointId.ClavicleLeft, JointId.ShoulderLeft },
        { JointId.ShoulderLeft, JointId.ElbowLeft },
        { JointId.ElbowLeft, JointId.WristLeft },
        { JointId.WristLeft, JointId.HandLeft },
        { JointId.ClavicleRight, JointId.ShoulderRight },
        { JointId.ShoulderRight, JointId.ElbowRight },
        { JointId.ElbowRight, JointId.WristRight },
        { JointId.WristRight, JointId.HandRight },
        { JointId.Pelvis, JointId.HipLeft },
        { JointId.HipLeft, JointId.KneeLeft },
        { JointId.KneeLeft, JointId.AnkleLeft },
        { JointId.AnkleLeft, JointId.FootLeft },
        { JointId.Pelvis, JointId.HipRight },
        { JointId.HipRight, JointId.KneeRight },
        { JointId.KneeRight, JointId.AnkleRight },
        { JointId.AnkleRight, JointId.FootRight }
    };

    for (int i = 0; i < bones.GetLength(0); i++)
        DrawBone(bones[i, 0], bones[i, 1]);


    foreach (JointId id in Enum.GetValues(typeof(JointId)).Cast<JointId>().Where(j => j != JointId.Count))
    {
        DrawJoint(id);
    }

    using var ms = new MemoryStream();
    bitmap.Save(ms, System.Drawing.Imaging.ImageFormat.Jpeg);
    ms.Seek(0, SeekOrigin.Begin);

    return Results.File(ms.ToArray(), "image/jpeg");
});


KinectService.Initialize();

app.Run();
