using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.Kinect.Sensor;
using Microsoft.Azure.Kinect.BodyTracking;
using System.Collections.Generic;

namespace KinectJointService.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class JointsController : ControllerBase
    {
        private static Device device;
        private static Tracker tracker;
        private static bool initialized = false;

        [HttpGet("live")]
        public IActionResult GetJoints()
        {
            if (!initialized)
            {
                device = Device.Open();
                device.StartCameras(new DeviceConfiguration
                {
                    ColorFormat = ImageFormat.ColorBGRA32,
                    ColorResolution = ColorResolution.Off,
                    DepthMode = DepthMode.NFOV_Unbinned,
                    CameraFPS = FPS.FPS30
                });

                tracker = Tracker.Create(device.GetCalibration(), new TrackerConfiguration
                {
                    ProcessingMode = TrackerProcessingMode.Gpu,
                    SensorOrientation = SensorOrientation.Default
                });

                initialized = true;
            }

            using var capture = device.GetCapture();
            tracker.EnqueueCapture(capture);
            using var frame = tracker.PopResult();

            if (frame.NumberOfBodies == 0)
                return NotFound("No bodies detected");

            var skeleton = frame.GetBody(0).Skeleton;
            var joints = new Dictionary<string, object>();

            foreach (JointId id in System.Enum.GetValues(typeof(JointId)))
            {
                if (id == JointId.Count) // Skip invalid enum value
                    continue;

                var joint = skeleton.GetJoint(id);
                joints[id.ToString()] = new
                {
                    X = joint.Position.X / 1000.0,
                    Y = joint.Position.Y / 1000.0,
                    Z = joint.Position.Z / 1000.0
                };
            }


            return Ok(joints);
        }
    }
}