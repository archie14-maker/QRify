import { useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import "./App.css";

function App() {
  const [type, setType] = useState("URL");
  const [text, setText] = useState("");
  const [wifiPassword, setWifiPassword] = useState("");
  const [wifiSecurity, setWifiSecurity] = useState("WPA");

  const [size, setSize] = useState(220);
  const [fgColor, setFgColor] = useState("#000000");
  const [bgColor, setBgColor] = useState("#ffffff");
  const [level, setLevel] = useState("H");
  const [margin, setMargin] = useState(2);

  const [recentQrs, setRecentQrs] = useState(() => {
    const saved = localStorage.getItem("qrify-recent");
    return saved ? JSON.parse(saved) : [];
  });

  const getQRValue = () => {
    if (type === "EMAIL") {
      return `mailto:${text}`;
    }

    if (type === "PHONE") {
      return `tel:${text}`;
    }

    if (type === "WIFI") {
      return `WIFI:T:${wifiSecurity};S:${text};P:${wifiPassword};;`;
    }

    return text;
  };

  const validateInput = () => {
    if (!text.trim()) {
      return "Please enter some content.";
    }

    if (
      type === "WIFI" &&
      wifiSecurity !== "nopass" &&
      !wifiPassword.trim()
    ) {
      return "Please enter the Wi-Fi password.";
    }

    if (type === "URL") {
      try {
        new URL(text);
      } catch {
        return "Please enter a valid URL.";
      }
    }

    if (type === "EMAIL") {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailPattern.test(text)) {
        return "Please enter a valid email address.";
      }
    }

    if (type === "PHONE") {
      const phonePattern = /^[0-9+\-\s()]{7,15}$/;

      if (!phonePattern.test(text)) {
        return "Please enter a valid phone number.";
      }
    }

    return "";
  };

  const error = validateInput();

  const saveRecentQR = () => {
    if (error) return;

    const newQR = {
      id: Date.now(),
      type: type,
      content: text,
    };

    const updated = [
      newQR,
      ...recentQrs.filter(
        (qr) => !(qr.type === type && qr.content === text)
      ),
    ].slice(0, 5);

    setRecentQrs(updated);
    localStorage.setItem("qrify-recent", JSON.stringify(updated));
  };

  const loadRecentQR = (qr) => {
    setType(qr.type);
    setText(qr.content);
  };

  const clearRecent = () => {
    setRecentQrs([]);
    localStorage.removeItem("qrify-recent");
  };

  const clearInput = () => {
    setText("");
    setWifiPassword("");
  };

  const downloadQR = () => {
    saveRecentQR();

    const canvas = document.querySelector("canvas");

    if (canvas) {
      const link = document.createElement("a");
      link.download = "qrify-qr-code.png";
      link.href = canvas.toDataURL("image/png");
      link.click();
    }
  };

  return (
    <div className="app">
      <div className="card">
        <h1>QRify</h1>

        <p className="subtitle">
          Create beautiful QR codes instantly
        </p>

        <label>QR Type</label>

        <select
          value={type}
          onChange={(e) => {
            setType(e.target.value);
            setText("");
            setWifiPassword("");
          }}
        >
          <option value="URL">URL</option>
          <option value="TEXT">Plain Text</option>
          <option value="EMAIL">Email</option>
          <option value="PHONE">Phone Number</option>
          <option value="WIFI">Wi-Fi</option>
        </select>

        <label>
          {type === "URL"
            ? "Website URL"
            : type === "TEXT"
            ? "Text"
            : type === "EMAIL"
            ? "Email Address"
            : type === "PHONE"
            ? "Phone Number"
            : "Wi-Fi Network Name"}
        </label>

        {type !== "WIFI" ? (
          <input
            type="text"
            placeholder={
              type === "URL"
                ? "https://example.com"
                : type === "TEXT"
                ? "Enter your text"
                : type === "EMAIL"
                ? "example@gmail.com"
                : "9876543210"
            }
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        ) : (
          <>
            <input
              type="text"
              placeholder="Wi-Fi network name"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />

            <input
              type="password"
              placeholder="Wi-Fi password"
              value={wifiPassword}
              onChange={(e) => setWifiPassword(e.target.value)}
            />

            <select
              value={wifiSecurity}
              onChange={(e) => setWifiSecurity(e.target.value)}
            >
              <option value="WPA">WPA/WPA2</option>
              <option value="WEP">WEP</option>
              <option value="nopass">No Password</option>
            </select>
          </>
        )}

        {text && error && (
          <p className="error">{error}</p>
        )}

        <div className="presets">
          <h2>Presets</h2>

          <button
            onClick={() => {
              setFgColor("#000000");
              setBgColor("#ffffff");
            }}
          >
            Classic
          </button>

          <button
            onClick={() => {
              setFgColor("#ffffff");
              setBgColor("#111111");
            }}
          >
            Dark
          </button>

          <button
            onClick={() => {
              setFgColor("#2563eb");
              setBgColor("#ffffff");
            }}
          >
            Blue
          </button>

          <button
            onClick={() => {
              setFgColor("#db2777");
              setBgColor("#ffffff");
            }}
          >
            Pink
          </button>
        </div>

        <div className="customization">
          <h2>Customize QR</h2>

          <label>
            Size: {size}px
          </label>

          <input
            type="range"
            min="150"
            max="400"
            value={size}
            onChange={(e) => setSize(Number(e.target.value))}
          />

          <label>Foreground Color</label>

          <input
            type="color"
            value={fgColor}
            onChange={(e) => setFgColor(e.target.value)}
          />

          <label>Background Color</label>

          <input
            type="color"
            value={bgColor}
            onChange={(e) => setBgColor(e.target.value)}
          />

          <label>Error Correction</label>

          <select
            value={level}
            onChange={(e) => setLevel(e.target.value)}
          >
            <option value="L">Low</option>
            <option value="M">Medium</option>
            <option value="Q">Quartile</option>
            <option value="H">High</option>
          </select>

          <label>
            Margin: {margin}
          </label>

          <input
            type="range"
            min="0"
            max="10"
            value={margin}
            onChange={(e) => setMargin(Number(e.target.value))}
          />
        </div>

        {text && !error && (
          <div className="qr-box">
            <QRCodeCanvas
              value={getQRValue()}
              size={size}
              fgColor={fgColor}
              bgColor={bgColor}
              level={level}
              marginSize={margin}
            />
          </div>
        )}

        {!text && (
          <p className="hint">
            Enter something above to generate your QR code
          </p>
        )}

        {text && (
          <button
            className="clear-btn"
            onClick={clearInput}
          >
            Clear Input
          </button>
        )}

        {text && !error && (
          <button
            className="download-btn"
            onClick={downloadQR}
          >
            Download PNG
          </button>
        )}

        {recentQrs.length > 0 && (
          <div className="recent-section">
            {(fgColor !== "#000000" ||
              bgColor !== "#ffffff") && (
              <p className="warning">
                ⚠️ Custom colors may affect QR scanning.
                Use high contrast for best results.
              </p>
            )}

            <div className="recent-header">
              <h2>Recent QR Codes</h2>

              <button
                className="clear-btn"
                onClick={clearRecent}
              >
                Clear
              </button>
            </div>

            {recentQrs.map((qr) => (
              <div
                className="recent-item"
                key={qr.id}
                onClick={() => loadRecentQR(qr)}
              >
                <div>
                  <strong>{qr.type}</strong>
                  <p>{qr.content}</p>
                </div>

                <span>↗</span>
              </div>
            ))}
          </div>
        )}

        <div className="footer">
          <p>Made with ❤️ using React</p>
        </div>
      </div>
    </div>
  );
}

export default App;