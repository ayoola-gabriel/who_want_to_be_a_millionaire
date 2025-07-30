window.addEventListener('DOMContentLoaded',()=>{
    let myAudio = document.getElementById("myAudio")
// myAudio.src="../audio/mainTheme.mp3"
    let start_game = document.getElementById('start-game')
    let settings = document.getElementById('settings')


    window.addEventListener('keydown', function(e){
        if(`${e.key}`==="ArrowRight"){
            this.window.open("/game.html", "_self")
        }  
        
        else if(`${e.key}`==="Enter"){
            // this.alert(`you pressed ${e.key}`)
            myAudio.play()
        }
    }, false)


    window.addEventListener('keypress',(e)=>{
        console.log(`${e.key}`)
        if(`${e.key}`== ' ') {
            document.getElementById('controls').classList.toggle('invisible')
        }
    })

    start_game.addEventListener('click',()=>{

        let q = JSON.parse(localStorage.getItem('wwtbam_qs'))
        console.log(q)
        if(q == null){
            let modal = new bootstrap.Modal(document.getElementById('noQuestionsModal'))
            modal.show()
            return
        }
        
        this.window.open('/game.html','_self')
    })

    settings.addEventListener('click',()=>{
        window.open('settings.html','_self')
    })
})

