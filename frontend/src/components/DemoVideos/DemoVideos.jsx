import "./DemoVideos.css";

const videos = [
  "https://digibundleshopz.online/wp-content/uploads/2024/06/AQOpon45KMc30b_ihRZyVje9m0CVOPircvd_dpeG58wyVrr1qpYN1n41LUksSDFxJx6HMH.mp4",
  "https://digibundleshopz.online/wp-content/uploads/2024/06/AQM7-Tlj9e39znCVm_2O3JKTczOr0Pe4grjd4EHVAMeB2dsK3SawzQapGoL2FS7c8U7DVJNPIu-vuMykY9zmnGeq.mp4",
  "https://digibundleshopz.online/wp-content/uploads/2024/06/AQMug3I0xCFH9cV3AXo5qRJu9Q_dFrGw_6CrjdX8XOxKL82N6s2FWjgOQeWoQRd-1.mp4",
  "https://digibundleshopz.online/wp-content/uploads/2024/06/AQMDI847YzfwV-2Fu_R-N06z-hz39CoxwKKvLySRGgKE3UnRkhELfxDC-oDAKAiaxHaiDm5qZH7IFYVXgI85hGRs-1.mp4",
];

const DemoVideos = () => {
  return (
    <section className="demo-videos-section">

      <div className="container">

        <h2 className="demo-title">
          DEMO CLIPS VIDEOS🔥
        </h2>

        <div className="video-wrapper">

          {videos.map((video, index) => (
            <div className="video-card" key={index}>

              <video
                controls
                preload="metadata"
                className="demo-video"
              >
                <source src={video} type="video/mp4" />
              </video>

            </div>
          ))}

        </div>

      </div>

    </section>
  );
};

export default DemoVideos;