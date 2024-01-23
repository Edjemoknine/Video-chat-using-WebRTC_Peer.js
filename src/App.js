import "./App.css";
import { useEffect, useRef, useState } from "react";
import Peer from "peerjs";

function App() {
  const [peerId, setPeerId] = useState();
  const [CallID, setCallID] = useState("");
  const remoteVideoStream = useRef();
  const CurrentVideoStream = useRef();
  const PeerInstance = useRef();

  useEffect(() => {
    const peer = new Peer();
    peer.on("open", (id) => {
      setPeerId(id);
    });

    var getUserMedia =
      navigator.getUserMedia ||
      navigator.webkitGetUserMedia ||
      navigator.mozGetUserMedia;

    peer.on("call", function (call) {
      getUserMedia({ video: true, audio: true }, function (stream) {
        call.answer(stream);

        CurrentVideoStream.current.srcObject = stream;
        CurrentVideoStream.current.play();

        call.on("stream", function (remoteStream) {
          remoteVideoStream.current.srcObject = remoteStream;
          remoteVideoStream.current.play();
        });
      });
    });

    PeerInstance.current = peer;
  }, []);

  const CallUser = (RemotePeerId) => {
    var getUserMedia =
      navigator.getUserMedia ||
      navigator.webkitGetUserMedia ||
      navigator.mozGetUserMedia;

    getUserMedia({ video: true, audio: true }, function (stream) {
      CurrentVideoStream.current.srcObject = stream;
      CurrentVideoStream.current.play();

      var call = PeerInstance.current.call(RemotePeerId, stream);

      call.on("stream", function (remoteStream) {
        remoteVideoStream.current.srcObject = remoteStream;
        remoteVideoStream.current.play();
      });
    });
  };

  return (
    <div className="App">
      <h1>{peerId}</h1>
      <div>
        <input
          type="text"
          value={CallID}
          onChange={(e) => setCallID(e.target.value)}
        />
        <button onClick={() => CallUser(CallID)}>Call</button>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))",
          gap: "20px",
        }}
      >
        <video autoPlay playsInline ref={remoteVideoStream} />
        <video autoPlay playsInline ref={CurrentVideoStream} />
      </div>
    </div>
  );
}

export default App;
