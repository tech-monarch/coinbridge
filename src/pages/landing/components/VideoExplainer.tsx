import { useRef, useState } from 'react';
import styles from './VideoExplainer.module.css';

export default function VideoExplainer() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlay = () => {
    setIsPlaying(true);
    videoRef.current?.play();
  };

  return (
    <section id="how-it-works-video" className={styles.section}>
      <div className={styles.container}>
        <div className={styles.eyebrow} data-aos="fade-up">
          <span className={styles.eyebrowDot} />
          <span className={styles.eyebrowText}>Watch &amp; learn</span>
        </div>

        <h2 className={styles.heading} data-aos="fade-up" data-aos-delay={80}>
          See <span className={styles.accent}>How It Works</span>
        </h2>
        <p className={styles.subheading} data-aos="fade-up" data-aos-delay={160}>
          A quick walkthrough of creating an account, funding your wallet,
          and making your first trade
        </p>

        <div
          className={styles.videoWrapper}
          data-aos="fade-up"
          data-aos-delay={240}
        >
          <video
            ref={videoRef}
            className={styles.video}
            src="/explanation.mov"
            loop
            muted
            playsInline
            controls={isPlaying}
            onPause={() => setIsPlaying(false)}
            preload="metadata"
          >
            Your browser does not support the video tag.
          </video>

          {!isPlaying && (
            <button
              type="button"
              className={styles.playOverlay}
              onClick={handlePlay}
              aria-label="Play explainer video"
            >
              <span className={styles.playButton}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="#0a0e1a">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </span>
              <span className={styles.playLabel}>Watch how it works</span>
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
