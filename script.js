const songName = document.getElementById('song-name');
const bandName = document.getElementById('band-name');
const cover = document.getElementById('cover');
const song = document.getElementById('audio');
const play = document.getElementById('play');
const next = document.getElementById('next');
const previous = document.getElementById('previous');
const likeButton = document.getElementById('like');
const barra = document.getElementById('barra');
const progressContainer = document.getElementById('progress-container');
const shuffleButton = document.getElementById('shuffle');
const repeatButton = document.getElementById('repeat');
const songTime = document.getElementById('song-time');
const totalTime = document.getElementById('total-time');



const better = {
    songName : 'Better',
    bandName : 'Khalid',
    file : 'khalid-better',
    liked: false
}
const inJesusName = {
    songName : 'In Jesus Name',
    bandName : 'Israel',
    file : 'in_jesus_name',
    liked: false
}
const noLouger = {
    songName : 'No Louger Bound',
    bandName : 'Forrest Frank',
    file : 'no_longer_bound',
    liked: false
}


let isPlaying = false;
let isShuffel = false;
let repeatOn =  false;
const playlistOriginal = JSON.parse(localStorage.getItem('playlist')) ?? [better,inJesusName,noLouger];
let sortedPlaylist = [...playlistOriginal];
let i = 0;

function playSong(){
    play.querySelector('.bi').classList.remove('bi-play-circle-fill');
    play.querySelector('.bi').classList.add('bi-pause-circle-fill');
    song.play();
    isPlaying = true;
}

function pauseSong(){
    play.querySelector('.bi').classList.add('bi-play-circle-fill');
    play.querySelector('.bi').classList.remove('bi-pause-circle-fill');
    song.pause();
    isPlaying = false;
}

function playPauseDecider(){
    if(isPlaying == true){
        pauseSong();
    }else{
        playSong();
    }
}

function like(){
    if (sortedPlaylist[i].liked === true) {
        likeButton.querySelector('.bi').classList.remove('bi-heart');
        likeButton.querySelector('.bi').classList.add('bi-heart-fill');
        likeButton.classList.add('button-active');
        
    }else{
        likeButton.querySelector('.bi').classList.remove('bi-heart-fill');
        likeButton.querySelector('.bi').classList.add('bi-heart');
        likeButton.classList.remove('button-active');
    }
    
}

function initializeSong(){
    cover.src = `images/${sortedPlaylist[i].file}.jpg`;
    song.src = `songs/${sortedPlaylist[i].file}.mp3`;
    songName.innerText = sortedPlaylist[i].songName;
    bandName.innerText = sortedPlaylist[i].bandName;
    like();
}

function previousSong() { //essa função faz a musica voltar
    if(i == 0){
        i = sortedPlaylist.length -1;
    }else{
        i--;
    }
    initializeSong();
    playSong();
    }

function nextSong() { //essa função faz a musica ir para a proxima
        if( i == sortedPlaylist.length -1){
            i = 0;
        }else{
            i++;
        }
        initializeSong();
        playSong();
        }

function updateProgress(){ //essa função atualiza a barra de progresso
    const barWith =  (song.currentTime/song.duration)*100
    barra.style.setProperty('--progress', `${barWith}%`); 
    songTime.innerText = toHHMMSS(song.currentTime);

}

function jumpTo(event){ 
    const width = progressContainer.clientWidth;
    const clickPosition = event.offsetX;
    const jumpToTime = (clickPosition/width)* song.duration;
    song.currentTime = jumpToTime;
}

function shuffleArray(preShuffleArray) {
    let size = preShuffleArray.length;
    let currentIndex = size -1;
    while (currentIndex > 0) {
        let randomIndex = Math.floor(Math.random() * size);
        let aux = preShuffleArray[currentIndex];
        preShuffleArray[currentIndex] = preShuffleArray[randomIndex];
        preShuffleArray[randomIndex] = aux;
        currentIndex--;
        }
}

function shuffleButtonClickend(){
    if (isShuffel === false){
        isShuffel = true;
        shuffleArray(sortedPlaylist);
        shuffleButton.classList.add('button-active');
        
    }else{
        isShuffel = false;
        sortedPlaylist = [...playlistOriginal];
        shuffleButton.classList.remove('button-active');
    } 

}

function repeatButtonClickend() {
    if (repeatOn === false){
        repeatOn = true;
        repeatButton.classList.add('button-active');
        
    }else{
        repeatOn = false;
        repeatButton.classList.remove('button-active');
    }
    
}

function nextOrRepeat(){
    if(repeatOn === false){
        nextSong();
    }else{
        playSong();
    }
}

function toHHMMSS(originalNumber) {
    let hours =  Math.floor(originalNumber / 3600);
    let min = Math.floor((originalNumber - hours * 3600) / 60);
    let secs = Math.floor(originalNumber - hours * 3600 - min * 60);
    return `${hours.toString().padStart(2,'0')}:${min.toString().padStart(2,'0')}:${secs.toString().padStart(2,'0')}`;
    
}

function updateTotalTime(){
    toHHMMSS(song.duration);
    totalTime.innerText = toHHMMSS(song.duration);
}

function likeButtonClickend() {
    if (sortedPlaylist[i].liked === false) {
        sortedPlaylist[i].liked = true;
    } else {
        sortedPlaylist[i].liked = false
    }
    like();
    localStorage.setItem('playlist', JSON.stringify(playlistOriginal));
}

initializeSong()

play.addEventListener('click', playPauseDecider); //reage a um evento e uma ação
previous.addEventListener('click', previousSong); 
next.addEventListener('click', nextSong);
song.addEventListener('timeupdate', updateProgress);
song.addEventListener('ended', nextOrRepeat);
song.addEventListener('loadedmetadata',updateTotalTime)
progressContainer.addEventListener('click', jumpTo);
shuffleButton.addEventListener('click', shuffleButtonClickend);
repeatButton.addEventListener('click', repeatButtonClickend);
likeButton.addEventListener('click', likeButtonClickend);


//playSong();