let currentSong = new Audio()
console.log("java")
let songs
let index
let currfolder
function sectomin(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00"
    }
    const minutes = Math.floor(seconds / 60)
    const remsec = Math.floor(seconds % 60)
    const formattedmin = String(minutes).padStart(2, '0')
    const formattedsec = String(remsec).padStart(2, '0')

    return `${formattedmin}:${formattedsec}`
}

async function getSongs(folder) {
    currfolder = folder
    let a = await fetch(`./songs/${folder}`)
    let response = await a.text()
    let div = document.createElement("div")
    div.innerHTML = response
    let as = div.getElementsByTagName("a")
    songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`/${folder}/`)[1])
        }
    }

    let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0]
    songUL.innerHTML = ``
    for (const song of songs) {
        songUL.innerHTML += `<li>
        <img src="assets/music.svg" class="invert" alt="">
        <div class="info">
        <div>${song.replaceAll("%20", " ")}</div>
        <div>Sukh</div>
        </div>
        <img src="assets/play.svg" class="invert" alt="">
        </li>`
    }
    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element => {
            console.log(e.querySelector(".info").firstElementChild.innerHTML)
            playMusic(e.querySelector(".info").firstElementChild.innerHTML)
        })
    })
    return songs
}

const playMusic = (track, pause = false) => {
    currentSong.src = `./songs/` + currfolder + "/" + track
    console.log(currfolder)
    console.log(currentSong.src)
    if (!pause) {
        currentSong.play();
        play.src = "assets/pause.svg"
    }
    document.querySelector(".songInfo").innerHTML = track.replaceAll("%20"," ")
    document.querySelector(".songTime").innerHTML = "00:00/00:00"
}

async function dispalbm() {
    let b = await fetch(`./songs/`)
    let res = await b.text()
    let d = document.createElement("div")
    d.innerHTML = res
    let anchors = d.getElementsByTagName("a")
    let arr = Array.from(anchors)
    for (let index = 0; index < arr.length; index++) {
        const e = arr[index];
            if (e.href.includes("/song")) {
                let folder = e.href.split("/").slice(-2)[0]
                let b = await fetch(`songs/${folder}/info.json`)
                res = await b.json()
                console.log(res)
    
                cc = document.querySelector(".cardContainer")
                cc.innerHTML += `<div data-fold="${folder}" class="card">
                            <div   class="play">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"
                                    color="black" fill="none">
                                    <path d="M9.00005 6C9.00005 6 15 10.4189 15 12C15 13.5812 9 18 9 18"
                                        stroke="currentColor" stroke-width="1.5" stroke-linecap="round"
                                        stroke-linejoin="round" />
                                </svg>
                            </div>
                            <img src='/songs/${folder}/cover.jpg' alt="">
                            <h2>${res.title}</h2>
                            <p>${res.description}</p>
                        </div>`
            }
            console.log(d)
            Array.from(document.getElementsByClassName("card")).forEach(e => {
                e.addEventListener("click", async item => {
                    songs = await getSongs(`${item.currentTarget.dataset.fold}`)
                    playMusic(songs[0])
                })
            })
        }
    
    }

async function main() {
    await getSongs("ninja2")
    currentSong.src = currfolder + "/" + songs[0]
    document.querySelector(".songInfo").innerHTML = songs[0].replaceAll("%20", " ")
    document.querySelector(".songTime").innerHTML = `${sectomin(currentSong.currentTime)}/${sectomin(currentSong.duration)} `
    // var audio = new Audio(songs[0]);
    // audio.play();

    dispalbm()
    play.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play()
            play.src = "assets/pause.svg"
        }
        else {
            currentSong.pause()
            play.src = "assets/play.svg"
        }
    })
    currentSong.addEventListener("timeupdate", () => {
        document.querySelector(".songTime").innerHTML = `${sectomin(currentSong.currentTime)}/${sectomin(currentSong.duration)} `;
        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + '%'
    })

    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100
        document.querySelector(".circle").style.left = percent + "%"
        currentSong.currentTime = (currentSong.duration * percent) / 100
    })

    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = 0
    })

    document.querySelector(".cross").addEventListener("click", () => {
        document.querySelector(".left").style.left = -110 + "%"
    })
    previous.addEventListener("click", () => {
        currentSong.pause();
        document.querySelector(".circle").style.left = 0
        index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        if ((index - 1) >= 0) {

            playMusic(songs[index - 1].replaceAll("%20", " "))
        }
    })
    next.addEventListener("click", () => {
        currentSong.pause();
        document.querySelector(".circle").style.left = 0

        index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
        if ((index + 1) < (songs.length)) {
            playMusic(songs[index + 1].replaceAll("%20", " "))
        }

    })
    document.querySelector(".volimg").addEventListener("click", () => {
        if (currentSong.volume > 0) {
            document.querySelector(".volimg").firstElementChild.src = "assets/mute.svg"
            currentSong.volume = 0
            document.querySelector(".range").value = 0
        }
        else {
            document.querySelector(".volimg").firstElementChild.src = "assets/volume.svg"
            currentSong.volume = 0.5
            document.querySelector(".range").value = 50
        }
    })
    document.querySelector(".range").addEventListener("change", e => {
        currentSong.volume = (e.target.value) / 100
    })


}

main()