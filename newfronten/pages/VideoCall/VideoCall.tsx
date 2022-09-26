import { addDoc, collection, deleteDoc, doc, getDoc, onSnapshot, query, updateDoc } from "firebase/firestore";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { db } from "../../firebase"
import CallIcon from '@mui/icons-material/Call';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import toast, { Toaster } from "react-hot-toast";
import './VideoCall.scss'
import { UseCurrentUser } from "../../lib/userContext";
// import { UseCurrentUser } from "";

// Initialize WebRTC
const servers = {
    iceServers: [
        {
            urls: ["stun:stun1.l.google.com:19302", "stun:stun2.l.google.com:19302"],
        },
    ],
    iceCandidatePoolSize: 10,
};

export default function VideoCall() {
    const pc = new RTCPeerConnection(servers);
    // Invite Mutation
    const link = "localhost:3030";
    const [webcamActive, setWebcamActive] = useState(false);
    const { id } = useParams();
    const navigate = useNavigate();
    const [roomId, setRoomId] = useState(id);
    const localRef = useRef();
    const remoteRef = useRef();
    const [time, setTime] = useState();
    const [mode, setMode] = useState("join");
    const [exists, setExists] = useState();

    useEffect(() => {
        if (id) {
            const ref = doc(db, "calls", id);
            getDoc(ref).then((snap) => {
                const snapExists = snap.exists();
                setExists(snapExists);
                if (snapExists) {
                    const data = snap.data();
                    if (data) {
                        if (!data.created) {
                            setMode("create");
                        }
                        setTime(data.time);
                    }
                }
            });
        }
    }, []);

    const setupSources = async () => {
        const localStream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true,
        });
        const remoteStream = new MediaStream();

        localStream.getTracks().forEach((track) => {
            pc.addTrack(track, localStream);
        });

        pc.ontrack = (event: any) => {
            event.streams[0].getTracks().forEach((track: any) => {
                remoteStream.addTrack(track);
            });
        };

        localRef.current.srcObject = localStream;
        remoteRef.current.srcObject = remoteStream;

        setWebcamActive(true);
        if (mode === "create") {
            const callDoc = await doc(db, "calls", roomId);
            await updateDoc(callDoc, {
                created: true,
            });
            const offerCandidates = await collection(
                db,
                `calls/${callDoc.id}/offerCandidates`
            );

            const answerCandidates = await collection(
                db,
                `calls/${callDoc.id}/offerCandidates`
            );

            setRoomId(callDoc.id);

            pc.onicecandidate = (event: any) => {
                console.log("event : ", event);
                event.candidate && addDoc(offerCandidates, event.candidate.toJSON());
            };

            const offerDescription = await pc.createOffer();
            await pc.setLocalDescription(offerDescription);

            const offer = {
                sdp: offerDescription.sdp,
                type: offerDescription.type,
            };

            // await callDoc.set({ offer });
            await updateDoc(callDoc, { offer });
            onSnapshot(callDoc, (snapshot: any) => {
                const data = snapshot.data();
                if (!pc.currentRemoteDescription && data?.answer) {
                    // console.log("data : ", data.answer);
                    const answerDescription = new RTCSessionDescription(data.answer);
                    pc.setRemoteDescription(answerDescription);
                }
            });
            onSnapshot(answerCandidates, (snapshot: any) => {
                snapshot.docChanges().forEach((change: any) => {
                    if (change.type === "added") {
                        const data = change.doc.data();
                        if (data) {
                            const candidate = new RTCIceCandidate(data);
                            pc.addIceCandidate(candidate);
                        }
                    }
                });
            });
        } else if (mode === "join") {
            // console.log("this is a join");
            const callDoc = doc(db, "calls", roomId);
            const answerCandidates = collection(
                db,
                "calls",
                roomId,
                "answerCandidates"
            );
            const offerCandidates = collection(
                db,
                "calls",
                roomId,
                "offerCandidates"
            );

            pc.onicecandidate = (event: any) => {
                event.candidate && addDoc(answerCandidates, event.candidate.toJSON());
            };

            // const callData = (await callDoc.get()).data();
            const callData = (await getDoc(callDoc)).data();

            if (callData?.offer) {
                const offerDescription = callData?.offer;
                await pc.setRemoteDescription(
                    new RTCSessionDescription(offerDescription)
                );
            }

            const answerDescription = await pc.createAnswer();
            await pc.setLocalDescription(answerDescription);

            const answer = {
                type: answerDescription.type,
                sdp: answerDescription.sdp,
            };

            await updateDoc(callDoc, { answer });

            onSnapshot(offerCandidates, (snapshot: any) => {
                snapshot.docChanges().forEach((change: any) => {
                    if (change.type === "added") {
                        let data = change.doc.data();
                        // console.log("offer : ", data);
                        if (data) pc.addIceCandidate(new RTCIceCandidate(data));
                    }
                });
            });
        }

        pc.onconnectionstatechange = (event: any) => {
            if (pc.connectionState === "disconnected") {
                hangUp();
            }
        };
    };

    const hangUp = async () => {
        pc.close();
        if (roomId) {
            const roomRef = doc(db, "calls", roomId);
            deleteDoc(roomRef);
            const pathname = window.location.pathname;
            if (pathname === "/create-room") {
                window.location.reload();
            } else {
                window.location.replace("/message");
            }
        }
        await updateDoc(doc(db, "rooms", chatRoomID), {
            videoRoomID: undefined
        })
    };

    if (time) {
        const newDate: any = new Date();
        const diff = newDate.getTime() - time.toDate().getTime();
        // console.log("diff : ", diff);
        if (diff <= 0) {
            console.log(time);
            toast(time)
            // return <Waiting time={time}></Waiting>;
        }
    }

    if (!exists) {
        console.log("not exists");
        // return <NotExists></NotExists>;
    }

    const { getUser } = UseCurrentUser()
    const [chatRoomID, setChatRoomID] = useState<any>()

    useEffect(() => {
        const q = query(collection(db, "rooms"))
        onSnapshot(q, (docs) => {
            docs.forEach(doc => {
                if (doc.data().videoRoomID != undefined || doc.data().videoRoomID != "") {
                    if (doc.data().videoRoomID == id) {
                        setChatRoomID(doc.id)
                    }
                }
            })
        })
    }, [id])

    async function handleCancel() {
        await updateDoc(doc(db, "rooms", chatRoomID), {
            videoRoomID: undefined
        })
        navigate('/message')
    }

    return (
        <div className="room">
            <Toaster />
            <video ref={localRef} autoPlay playsInline className="local" />
            <video ref={remoteRef} autoPlay playsInline className="remote" />

            <div className="buttonsContainer">
                <button
                    onClick={hangUp}
                    disabled={!webcamActive}
                    className="hangup button"
                >
                    <CallIcon className="phone-icon" />
                </button>
                <div tabIndex={0} role="button" className="more button">
                    <MoreVertIcon className="ellipsis-icon" />
                    <div className="popover">
                        <button
                            onClick={() => {
                                navigator.clipboard.writeText(link + "/server/" + roomId);
                                toast.success("Coppied to clipboard!");
                            }}
                        >
                            <ContentCopyIcon /> Copy joining code
                        </button>
                    </div>
                </div>
            </div>

            {!webcamActive && (
                <div className="modalContainer">
                    <div className="modal">
                        <h3>Please turn on your camera and microphone to start the call</h3>
                        <div className="container">
                            <button onClick={() => handleCancel()} className="secondary">
                                Cancel
                            </button>
                            <button onClick={setupSources} className="primary">Start</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}