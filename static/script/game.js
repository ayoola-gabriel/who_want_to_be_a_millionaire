window.addEventListener('DOMContentLoaded', () => {
  let option = "";
  let collection = this.document.getElementsByClassName("option");
  let question = document.getElementById("question");
  let countdown = document.getElementById("countdown");
  let myAudio = document.getElementById("myAudio");
  let timeSound = document.getElementById('time-sound')
  let qs_container = document.getElementById('qs-container')
  let option_a = document.getElementById('option_a')
  let option_b = document.getElementById('option_b')
  let option_c = document.getElementById('option_c')
  let option_d = document.getElementById('option_d')
  let lets_play_audio = document.getElementById("lets-play")
  let timer_p = document.getElementById('cnt')
  let cntd = 62000
  let no_of_questions = 15

  timeSound.src = '/static/audio/slow-tick.mp3'

  let current_qs = null
  let next_qs = null;
  let qs = null; var t = undefined
  const tm_1 = null; const tm_2 = null; const tm_3 = null; const tm_4 = null; const tm_5 = null
  let timeoutID = [tm_1, tm_2, tm_3, tm_4, tm_5]
  let option_selected = false;

   let show_hide_state = false
   let two_player_mode = false


  //function to hide question after it is answered without animation
  const hide_question_no_animation = () => {
    qs_container.classList.add('invisible')
    countdown.classList.add("invisible")
    question.innerHTML = ""
    option_a.innerText = ""
    option_b.innerText = ""
    option_c.innerText = ""
    option_d.innerText = ""
    timer_p.classList.remove('text-bg-danger')
    timer_p.classList.remove('text-bg-warning')
    timer_p.classList.remove('text-bg-success')
    timer_p.classList.add('text-bg-dark')
    timer_p.innerText = '00:00'
    option_a.classList.remove('invisible')
    option_b.classList.remove('invisible')
    option_c.classList.remove('invisible')
    option_d.classList.remove('invisible')

    for (let i = 0; i < 4; i++) {
      collection[i].classList.remove('text-bg-success')
      collection[i].classList.remove('text-bg-danger')
      collection[i].classList.remove('text-bg-warning')
      collection[i].classList.add('text-bg-dark')
      collection[i].classList.add("invisible");
      collection[i].classList.remove('right')
      collection[i].classList.remove('wrong')

    }
    option_selected = false
    option = ""
  }

  //function to hide question after it is answered with animation
  // const hide_questions = () => {
  //   timeoutID[0] = setTimeout(() => {
  //     qs_container.classList.add('invisible')
  //     countdown.classList.add("invisible")
  //     timer_p.classList.remove('text-bg-danger')
  //     timer_p.classList.remove('text-bg-warning')
  //     timer_p.classList.remove('text-bg-success')
  //     timer_p.classList.add('text-bg-dark')
  //     question.innerHTML = ""
  //     option_a.innerText = ""
  //     option_b.innerText = ""
  //     option_c.innerText = ""
  //     option_d.innerText = ""
  //     document.getElementById('cnt').innerText = '00:00'

  //     for (let i = 0; i < 4; i++) {
  //       collection[i].classList.remove('text-bg-success')
  //       collection[i].classList.remove('text-bg-danger')
  //       collection[i].classList.add('text-bg-dark')
  //     }
  //   }, 5000);

  //   timeoutID[1] = setTimeout(() => {
  //     collection[0].classList.add("invisible");
  //   }, 4900);

  //   timeoutID[2] = setTimeout(() => {
  //     collection[1].classList.add("invisible");
  //   }, 4800);

  //   timeoutID[3] = setTimeout(() => {
  //     collection[2].classList.add("invisible");
  //   }, 4600);

  //   timeoutID[4] = setTimeout(() => {
  //     collection[3].classList.add("invisible");
  //     // myAudio.src = "audio/mainTheme.mp3";
  //     // myAudio.play();
  //     // myAudio.loop = true;

  //   }, 4500);
  // }

  //functions to convert option A-D to 0-3
  let map_id = (id) => {
    return id.toUpperCase().charCodeAt(0) - 'A'.charCodeAt(0);
  }

  // function to highlight options
  let highlight_bg = (id, former_bg, new_bg) => {

    id.classList.remove(former_bg)
    id.classList.add(new_bg)
  }

  //countdown timer function
  let start_timer = (element, time_out, max_time) => {
    t = setInterval(() => {
      // Get today's date and time
      let now = new Date().getTime();
      // console.log(now)
      // Find the distance between now and the count down date
      let distance = time_out - now;

      // Time calculations for days, hours, minutes and seconds
      let minutes = Math.trunc((distance % (1000 * 60 * 60)) / (1000 * 60));
      let seconds = Math.trunc((distance % (1000 * 60)) / 1000);

      // Output the result in an element with id="demo"
      element.innerHTML = `${Math.trunc(minutes / 10)}` + `${Math.trunc(minutes % 10)}` + ":" + `${Math.trunc(seconds / 10)}` + `${Math.trunc(seconds % 10)}`;

      // If the count down is over, write some text
      if (distance > (max_time * 0.5)) {
        highlight_bg(element, 'text-bg-dark', 'text-bg-success')
      }
      else if (distance > (max_time * 0.25) && distance < (max_time * 0.5)) {
        highlight_bg(element, 'text-bg-success', 'text-bg-warning')
        timeSound.play()
      }
      else if (distance > 0 && distance < (max_time * 0.25)) {
        highlight_bg(element, 'text-bg-warning', 'text-bg-danger')
        // timeSound.src='audio/fast-tick.mp3'
        timeSound.play()
      }

      if (option != "") {
        clearInterval(t)
        timeSound.pause()
      } else if (distance < 0) {
        clearInterval(t);
        // time.style='background-color:red;'
        question_answered = true
        element.innerHTML = '00:00';
      }
    }, 1000);
  }

  //function to show questions
  let question_answered = false
  const show_questions = (qs, id) => {
    lets_play_audio.play();
    // myAudio.pause();

    question.innerHTML = qs[id].question
    option_a.innerText = qs[id].options.A
    option_b.innerText = qs[id].options.B
    option_c.innerText = qs[id].options.C
    option_d.innerText = qs[id].options.D;
    two_player_mode ? (
    (id % 2 === 0) ? (
      highlight_bg(document.getElementById('scoreboard_b'), 'bg-secondary', 'bg-light-subtle'),
      highlight_bg(document.getElementById('scoreboard_a'), 'bg-light-subtle', 'bg-secondary')
    ):(
      (id == 1)? null : highlight_bg(document.getElementById('scoreboard_a'), 'bg-secondary', 'bg-light-subtle'),
       highlight_bg(document.getElementById('scoreboard_b'), 'bg-light-subtle', 'bg-secondary')
    )
        ): null

    for (let i = 0; i < 4; i++) {
      if (map_id(qs[id].answer) === i) {
        collection[i].classList.add('right')
        continue
      }
      collection[i].classList.add('wrong')
    }

    //Codes to select which music to play
    if (id >= 1 && id < 5) {
      myAudio.src = "/static/audio/100.mp3";
    } else if (id >= 5 && id < 10) {
      myAudio.src = "/static/audio/200.mp3";
    } else if (id >= 10 && id < 15) {
      myAudio.src = "/static/audio/300.mp3";
    } else if (id >= 15 && id < 20) {
      myAudio.src = "/static/audio/400.mp3";
    } else if (id >= 20 && id < 25) {
      myAudio.src = "static/audio/500.mp3";
    } else if (id >= 25) {
      myAudio.src = "/static/audio/600.mp3";
    }

    //timer action
    setTimeout(() => {

      let time = document.getElementById("cnt")
      countdown.classList.remove("invisible")
      // Set the date we're counting down to
      let today = new Date().getTime();
      let cnt = today + cntd;

      // console.log(option)

      start_timer(time, cnt, cntd)

      qs_container.classList.remove('invisible')
    }, 1000);

    setTimeout(() => {
      collection[0].classList.remove('invisible')
    }, 3000)

    setTimeout(() => {
      collection[1].classList.remove('invisible')
    }, 3500)

    setTimeout(() => {
      collection[2].classList.remove('invisible')
    }, 4000)

    setTimeout(() => {
      collection[3].classList.remove('invisible')
    }, 4500)

    setTimeout(() => {
      myAudio.play();
      // countdown.classList.remove('invisible')
    }, 4000);
    question_answered = false
  }

  //load event
  window.addEventListener('load', () => {
    current_qs = 1
    qs = JSON.parse(localStorage.getItem('wwtbam_qs'))
    if (!qs) {
      alert("No questions found. Please set the questions in the settings page.");
      window.open('/settings.html', '_self');
      return;
    }
    cntd = Number((qs.settings.timer) * 1000) + 2000
    show_hide_state = qs.settings.controls
    continue_to_next = qs.settings.auto_next_question
    no_of_questions = qs.settings.number_of_questions
    show_hide_function()
    show_questions(qs, current_qs)

    if(qs.settings.show_scoreboard === true) {
      document.getElementById('scoreboard_a').classList.remove('invisible')
      document.getElementById('scoreboard_b').classList.remove('invisible')
      player_a_box.innerText = 0
      player_b_box.innerText = 0
    } else{
      document.getElementById('scoreboard_a').classList.add('invisible')
      document.getElementById('scoreboard_b').classList.add('invisible')
    }

    if(qs.settings.end_game_after_wrong_answer === true) {
      end_game_after_wrong_answer = true
    }

    if(qs.settings.two_player_mode == true) {
      two_player_mode = true
      document.getElementById('scoreboard_b').classList.remove('text-white')
    } else {
      two_player_mode = false
      document.getElementById('scoreboard_b').classList.add('text-white')
    }
  })

  //function to highlight an option when it is chosen
  let highlight_options = (key) => {
    option_selected = true

    if (key == "a" || key == "A") {
      for (let i = 0; i < 4; i++) {
        if (i == 0) {
          highlight_bg(collection[0], 'text-bg-dark', 'text-bg-warning')
          continue
        }
        highlight_bg(collection[i], 'text-bg-warning', 'text-bg-dark')
      }
      option = collection[0];
    } else if (key == "b" || key == "B") {
      for (let i = 0; i < 4; i++) {
        if (i == 1) {
          highlight_bg(collection[1], 'text-bg-dark', 'text-bg-warning')
          continue
        }
        highlight_bg(collection[i], 'text-bg-warning', 'text-bg-dark')
      }
      option = collection[1];
    } else if (key == "c" || key == "C") {
      for (let i = 0; i < 4; i++) {
        if (i == 2) {
          highlight_bg(collection[2], 'text-bg-dark', 'text-bg-warning')
          continue
        }
        highlight_bg(collection[i], 'text-bg-warning', 'text-bg-dark')
      }
      option = collection[2];
    } else if (key == "d" || key == "D") {
      for (let i = 0; i < 4; i++) {
        if (i == 3) {
          highlight_bg(collection[3], 'text-bg-dark', 'text-bg-warning')
          continue
        }
        highlight_bg(collection[i], 'text-bg-warning', 'text-bg-dark')
      }
      option = collection[3];
    } else if (key == 'Escape' || key == 'q' || key == "Q" || key == "Q" || key == "x" || key == "X") {
      for (let i = 0; i < 4; i++) {
        highlight_bg(collection[i], 'text-bg-warning', 'text-bg-dark')
      }
      option = null;
      option_selected = false;
    }
  }

  //function for 50/50 and selecting the right answer
  let _50_50 = () => {
    let wrong = document.getElementsByClassName("wrong");

    for (let i = 0; i < wrong.length; i++) {
      wrong[i].childNodes[1].childNodes[3].classList.add("invisible");
    }
    const x = Math.floor(Math.random() * 3);
    wrong[x].childNodes[1].childNodes[3].classList.remove("invisible");
  }

  //function for marking the questions
  let no_of_right_answer_player_a = 0
  let no_of_right_answer_player_b = 0
  let continue_to_next = false
  let player_a_box = document.getElementById('player_a')
  let player_b_box = document.getElementById('player_b')
  let end_game_after_wrong_answer = false
  let right_answer = false
  

  let mark_right_answer = (state) => {
    if (state === true) {
      let right = document.getElementsByClassName("right");
      // console.log(current_qs%2===0)
      question_answered = true
      if (option != right[0]) {
        highlight_bg(option, 'text-bg-warning', 'text-bg-danger')
        highlight_bg(right[0], 'text-bg-dark', 'text-bg-success')
        right_answer = false
        
        //Total Score after wrong answer for one player
        if(end_game_after_wrong_answer === true) {
        setTimeout(() => {
           document.getElementById('final-score').innerText = no_of_right_answer_player_a
           let modal = new bootstrap.Modal(document.getElementById('gameOverModal'))
           modal.show()
        },2000)
       }
        myAudio.src = "/static/audio/wrong.mp3";
        myAudio.play();
      } else {
        highlight_bg(right[0], 'text-bg-warning', 'text-bg-success')
        if(two_player_mode === true) {
          (current_qs % 2 === 0) ? (
            no_of_right_answer_player_b += 1,
            player_b_box.innerHTML = no_of_right_answer_player_b
          ):(
            no_of_right_answer_player_a += 1,
            player_a_box.innerHTML = no_of_right_answer_player_a
          )
        } else {
        no_of_right_answer_player_a += 1,
        player_a_box.innerText = no_of_right_answer_player_a
        }
        right_answer = true
        myAudio.src = "static/audio/correct.mp3";
        myAudio.play();
      }

     
    option_selected = false
    next_qs = current_qs + 1

     if(continue_to_next == true){
      this.setTimeout(()=>{
        goto_next_question(question_answered, right_answer)
      },4000)
     }
    }
  }

  //function to go to the next question
  let goto_next_question = (question_answered, right_answer) => {
    if (question_answered === true) {
      for (let i = 0; i < 6; i++) {
        this.clearTimeout(timeoutID[i])
      }
      if (next_qs <= no_of_questions) {
        if(end_game_after_wrong_answer === true && right_answer === false) {
          console.log('Game Over!')
        } else {
        hide_question_no_animation()
        show_questions(qs, next_qs)
        current_qs = next_qs
        x = null
        }
      } else {
        let modal = null
        two_player_mode ? (
          document.getElementById('final-score-player-a').innerText = no_of_right_answer_player_a,
           document.getElementById('final-score-player-b').innerText = no_of_right_answer_player_b,
          modal = new bootstrap.Modal(document.getElementById('twoPlayerScoresModal')),
          modal.show()
        ):(
          document.getElementById('all-correct-score').innerText = no_of_right_answer_player_a,
          modal = new bootstrap.Modal(document.getElementById('allCorrectModal')),
          modal.show()
        )
        
      }
    }
  }

  //Function to scan which of the keys is pressed for options
  let options_array = (key) => {
    const keys = ['a', 'b', 'c', 'd', 'q', 'x', 'A', 'B', 'C', 'D', 'Q', 'X', 'Escape']
    for (let i = 0; i < keys.length; i++) {
      if (key == keys[i]) {
        return true
      }
    }
    return false
  }

  //Show/hide controls function
 
  let show_hide_function = () => {
    show_hide_state = !show_hide_state
    show_hide_state ? (
      document.getElementById('controls-container').classList.add('invisible'),
      document.getElementById('control-show').innerHTML = `<i class="bi bi-eye fs-3 text-secondary"></i>`
  ) : (
      document.getElementById('controls-container').classList.remove('invisible'),
      document.getElementById('control-show').innerHTML = `<i class="bi bi-eye-slash fs-3 text-secondary"></i>`
    )
  }

  //Audio muting function
  let mute_toggle_state = false
  let audio_mute_func = () => {
    mute_toggle_state = !mute_toggle_state
    mute_toggle_state? 
      (document.getElementById('control-mute').innerHTML = `<i class="bi bi-volume-mute fs-3 text-secondary"></i>`)
      :(
        document.getElementById('control-mute').innerHTML = `<i class="bi bi-volume-up fs-3 text-secondary"></i>`
      )
    myAudio.muted = mute_toggle_state
    lets_play_audio.muted = mute_toggle_state
    timeSound.muted = mute_toggle_state
  }

  // Keydown events
  window.addEventListener(
    "keydown",
    function (e) {
      e.preventDefault()
      let key = e.key;
      if (options_array(key) == true) {
        highlight_options(key)
      } else if (`${e.key}` === "Delete") {
        _50_50()
      } else if (`${e.key}` === "Enter") {
        mark_right_answer(option_selected)
      } else if (`${e.key}` === "ArrowRight") {
        goto_next_question(question_answered, right_answer)
      } else if (`${e.key}` === " ") {
        show_hide_function()
      } else if (key === 'm' || key === 'M' ) {
        audio_mute_func()
      }
    },
    false
  );

  //click events
  let toggle_option_a = false
  document.getElementById('select-option-a').addEventListener('click', (e) => {
    toggle_option_a = !toggle_option_a
    toggle_option_a?highlight_options('a'):highlight_options('q')
  })

  let toggle_option_b = false
  document.getElementById('select-option-b').addEventListener('click', (e) => {
    toggle_option_b = !toggle_option_b
    toggle_option_b?highlight_options('b'):highlight_options('q')
  })

  let toggle_option_c = false
  document.getElementById('select-option-c').addEventListener('click', (e) => {
    toggle_option_c = !toggle_option_c
    toggle_option_c?highlight_options('c'):highlight_options('q')
  })

  let toggle_option_d = false
  document.getElementById('select-option-d').addEventListener('click', (e) => {
    toggle_option_d = !toggle_option_d
    toggle_option_d?highlight_options('d'):highlight_options('q')
  })

  document.getElementById('control-mute').addEventListener('click', () => {
    audio_mute_func()
  })

  document.getElementById('control-show').addEventListener('click', () => {
    show_hide_function()
  })

  let _50_50_life_line = false
  document.getElementById('control-50-50').addEventListener('click', () => {
    if(_50_50_life_line == false){
      _50_50()
      document.getElementById('control-50-50').disabled = true
    }
  })

  document.getElementById('control-final-answer').addEventListener('click', () => {
    mark_right_answer(option_selected)
  })

  document.getElementById('control-next').addEventListener('click', () => {
    goto_next_question(question_answered, right_answer)
  })



})
