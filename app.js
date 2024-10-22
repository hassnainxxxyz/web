const APP_ID = "969a9fb366a540579fc804a0e516099d"


let uid = sessionStorage.getItem('uid')
if(!uid){
    uid = String(Math.floor(Math.random() * 10000))
    sessionStorage.setItem('uid', uid)
}

let token = null;
let client;

let rtmClient;
let channel;

const queryString = window.location.search
const urlParams = new URLSearchParams(queryString)
let roomId = urlParams.get('room')

if(!roomId){
    roomId = 'main'
}

// let displayName = sessionStorage.getItem('display_name')
// if(!displayName){
//     window.location = 'lobby.html'
// }

let localTracks = []
let remoteUsers = {}

let localScreenTracks;
let sharingScreen = false;

let joinRoomInit = async () => {







    client = AgoraRTC.createClient({mode:'rtc', codec:'vp8'})
    await client.join(APP_ID, roomId, token, uid)

    client.on('user-published', handleUserPublished)

    joinStream();



}

let joinStream = async () => {




    localTracks = await AgoraRTC.createMicrophoneAndCameraTracks({}, {encoderConfig:{
            width:{min:640, ideal:1920, max:1920},
            height:{min:480, ideal:1080, max:1080}
        }})



    localTracks[1].play('player-1');
    await client.publish([localTracks[0], localTracks[1]])
}


let handleUserPublished = async (user, mediaType) => {
    remoteUsers[user.uid] = user

    await client.subscribe(user, mediaType)



    if(mediaType === 'video'){
        user.videoTrack.play('player-2');
    }

    if(mediaType === 'audio'){
        user.audioTrack.play()
    }



    alert(mediaType);

}






joinRoomInit()