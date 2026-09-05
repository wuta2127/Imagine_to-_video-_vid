'use client';

import { useState } from 'react';

export default function Home() {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState('');
  const [prompt, setPrompt] = useState('');
  const [duration, setDuration] = useState('5');
  const [loading, setLoading] = useState(false);
  const [videoUrl, setVideoUrl] = useState('');
  const [error, setError] = useState('');

  function handleImage(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImage(file);
    setPreview(URL.createObjectURL(file));
    setVideoUrl('');
    setError('');
  }

  async function generateVideo() {
    if (!image || !prompt.trim()) {
      setError('Please upload an image and enter a prompt.');
      return;
    }

    setLoading(true);
    setError('');
    setVideoUrl('');

    const form = new FormData();
    form.append('image', image);
    form.append('prompt', prompt);
    form.append('duration', duration);

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        body: form
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Generation failed.');

      setVideoUrl(data.videoUrl);
    } catch (err) {
      setError(err.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="page">
      <section className="hero">
        <div>
          <span className="badge">AI VIDEO STUDIO</span>
          <h1>Turn one image into a video.</h1>
          <p>
            Upload an image, describe how it should move, and generate a short AI video.
          </p>
        </div>
      </section>

      <section className="card">
        <div className="grid">
          <div className="panel">
            <label className="label">1. Upload image</label>
            <label className="upload">
              <input type="file" accept="image/*" onChange={handleImage} />
              {preview ? (
                <img src={preview} alt="Uploaded preview" />
              ) : (
                <div className="uploadEmpty">
                  <div className="uploadIcon">＋</div>
                  <strong>Choose an image</strong>
                  <span>PNG, JPG or WEBP</span>
                </div>
              )}
            </label>
          </div>

          <div className="panel">
            <label className="label">2. Describe the motion</label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Example: Slowly move the camera forward while the leaves sway gently in the wind. Keep the subject realistic and stable."
              rows={8}
            />

            <div className="row">
              <div>
                <label className="label small">Duration</label>
                <select value={duration} onChange={(e) => setDuration(e.target.value)}>
                  <option value="5">5 seconds</option>
                  <option value="8">8 seconds</option>
                  <option value="10">10 seconds</option>
                </select>
              </div>
            </div>

            <button className="generate" onClick={generateVideo} disabled={loading}>
              {loading ? 'Generating…' : 'Generate video'}
            </button>

            {error && <p className="error">{error}</p>}
          </div>
        </div>

        <div className="result">
          <label className="label">3. Result</label>
          {videoUrl ? (
            <video controls autoPlay loop src={videoUrl} />
          ) : (
            <div className="videoPlaceholder">
              <span>Your generated video will appear here.</span>
            </div>
          )}
        </div>
      </section>

      <footer>
        Starter app • Connect your preferred image-to-video API in <code>/app/api/generate/route.js</code>
      </footer>
    </main>
  );
}
