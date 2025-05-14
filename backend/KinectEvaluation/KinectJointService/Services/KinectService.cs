using Microsoft.Azure.Kinect.Sensor;
using Microsoft.Azure.Kinect.BodyTracking;
using System;

namespace KinectJointService.Services
{
    public static class KinectService
    {
        public static Device Device;
        public static Tracker Tracker;

        public static void Initialize()
        {
            Device = Device.Open();
            Device.StartCameras(new DeviceConfiguration
            {
                ColorFormat = ImageFormat.ColorBGRA32,
                ColorResolution = ColorResolution.R720p,
                DepthMode = DepthMode.NFOV_Unbinned,
                CameraFPS = FPS.FPS30
            });

            // Forzar la ruta del modelo ONNX
            Environment.SetEnvironmentVariable(
                "AZUREKINECT_BODY_TRACKING_MODEL_PATH",
                @"C:\Program Files\Azure Kinect Body Tracking SDK\tools"
            );

            Tracker = Tracker.Create(Device.GetCalibration(), new TrackerConfiguration
            {
                ProcessingMode = TrackerProcessingMode.Cpu,
                SensorOrientation = SensorOrientation.Default
            });
        }

    }
}
