window.addEventListener("DOMContentLoaded", () => {
 
  // Get Elements and Variable Declarations
  const gemini_key = window.appConfig.gemini_api_key;
  let questions_json = {}
  let questionID = document.getElementById("questionID");
  let question = document.getElementById("question");
  let option_a = document.getElementById("optionA");
  let option_b = document.getElementById("optionB");
  let option_c = document.getElementById("optionC");
  let option_d = document.getElementById("optionD");
  let previous_btn = document.getElementById("previousQuestion");
  let next_btn = document.getElementById("nextQuestion");
  let option_radios = document.getElementsByName("correct-option");
  let play_btn = document.getElementById('play_game')
  let clear_field_btn = document.getElementById('clear-btn')
  let submit_btn = document.getElementById('submitQuestion')
  let auto_generate_btn = document.getElementById('auto-generate')
  let auto_group = document.getElementById('auto-group')
  let auto_subjects = document.getElementById('auto-subjects')
  let auto_alert = document.getElementById('auto-alert')
  let show_controls = document.getElementById('game-controls')
  let count_time = document.getElementById('countdown-time')
  let alert_wait = `<div class="alert alert-secondary text-center" role="alert">
                      <span class="spinner-border me-2" role="status" aria-hidden="true"></span>
                      </div>`
  let alert_success = `<div class="alert alert-success text-center" role="alert">
                        <i class="bi bi-check2-circle me-2"></i>Success
                        </div>`
  let alert_failed = `<div class="alert alert-warning text-center" role="alert">
                              <i class="bi bi-exclamation-circle me-2"></i>Failed to Generate
                              </div>`
  let no_of_questions = document.getElementById('no-of-questions')
  //////////////////////////////////////////


  let make_prompt = (no, subjects, group) => {
    return `Generate ${no} questions for a "Who Wants to be a Millionaire kind of game that covers the following subjects: ${subjects}. Bear in mind that the question should be targeted at ${group}. Return the response in JSON using this format: 1: {question:, options: {A: B: C: D:}, answer: C}... Let the questions be from easy to medium to very hard. The length of words for the options should not be more than 7 words while the question should not be more than 18 words`
  }

  let parse_auto_response = (response) => {
    let lines = response.trim().split('\n')
    if (lines[0].startsWith("```") && lines[lines.length-1].startsWith("```")){
      const jsonString = lines.slice(1,-1).join('\n')
      try {
        return JSON.parse(jsonString)
      } catch(e) {
        console.error("Invalid JSON:", e.message)
        return null
      }
    } else {
      console.warn("No Markdown code block detected")
      return null
    }
  }

  let auto_fields_disabled = (condition) => {
    auto_generate_btn.disabled = condition
    auto_subjects.disabled = condition
    auto_group.disabled = condition
  }

  let map_letter_to_number = (letter) => {
    return letter.toUpperCase().charCodeAt(0) - 'A'.charCodeAt(0);
  }

 let numberToLetter = (num) => {
  if (num >= 0 && num <= 3) {
    return String.fromCharCode('A'.charCodeAt(0) + num);
  }
  return null; // or throw an error / return empty string
}

  let load_qs = (id) =>{
    if(check_storage(id) == true) {
      questionID.value = id;
      question.value = questions_json[id].question;
      option_a.value = questions_json[id].options.A;
      option_b.value = questions_json[id].options.B;
      option_c.value = questions_json[id].options.C;
      option_d.value = questions_json[id].options.D;
      option_radios[map_letter_to_number(questions_json[id].answer)].checked = true;
  } else {
      questionID.innerHTML = ""
      for(let i=1;i<=id;i++){
        questionID.innerHTML += `<option>${i}</option>`
      }
      questionID.value = id
  }

  if (questionID.value == 1) {
    previous_btn.disabled = true;
  }
}

  let get_checked_option = () => {
    let correct = null;
    for (let i = 0; i < option_radios.length; i++) {
      if (option_radios[i].checked == true) {
        correct = i;
        break;
      }
    }
    return numberToLetter(correct);
  };

  let load_prev = () => {
    if(next_btn.disabled == true) {
        next_btn.disabled = false
    }
    if (questionID.value != 1) {
      id = Number(questionID.value) - 1;
      load_qs(id)
      if(id==1){
        previous_btn.disabled = true
      }
    } 
  };

  let clear_forms = () => {
    question.value = ""
    option_a.value = ""
    option_b.value = ""
    option_c.value = ""
    option_d.value = ""
    for(let i=0;i<4;i++){
      option_radios[i].checked = false
    }   
  }

  let check_storage = (index) => {
    let questions_json_length = Object.keys(questions_json).length;
    if (index >= questions_json_length) {
     clear_forms()
      return false
    }
    return true
  }

  let load_next = () => {
    let questionNo = Number(questionID.value);
    if(questionNo==(no_of_questions.value)-1){
        console.log('Final Question')
        next_btn.disabled = true;
        return
    }
    let id = questionNo + 1;
    questionID.value = id
    load_qs(id)
  }

  window.addEventListener('load',()=>{
    let j = JSON.parse(localStorage.getItem("wwtbam_qs"));
    previous_btn.disabled = true
    if(j){
    console.log(j)
    questions_json = JSON.parse(JSON.stringify(j))
    load_qs(1)
     questionID.innerHTML = ""
     no_of_questions.value = questions_json.settings.number_of_questions
    for(let i=1;i<=questions_json.settings.number_of_questions;i++){
      questionID.innerHTML += `<option>${i}</option>`
    }
    show_controls.checked = questions_json.settings.controls
    count_time.value = questions_json.settings.timer
    document.getElementById('mode-control').checked = questions_json.settings['Two_player_mode']
    document.getElementById('end-game').checked = questions_json.settings['End_game_after_wrong_answer']
    document.getElementById('show-scoreboard').checked = questions_json.settings.show_scoreboard
    auto_next_qs.checked = questions_json.settings.auto_next_question
    } 
  })

  auto_generate_btn.addEventListener('click',()=>{
    let prompt = make_prompt(no_of_questions.value, auto_subjects.value,
                auto_group.value)

    auto_alert.innerHTML = alert_wait
    auto_fields_disabled(true)

    fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent",
      {
        method: "POST",
        body: JSON.stringify({
          "contents": [
        {
            "parts": [
                {
                    "text": `${prompt}`
                }
            ]
        }
    ]
      }),
        headers: {
          "Content-type": "application/json",
          "x-goog-api-key": `${gemini_key}`,
        }
      })
      .then(response => {
        if(!response.ok){
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        return response.json()
      } )
      .then(data => {
        //Process the data
        questions_json = parse_auto_response(data.candidates[0].content.parts[0].text)
        auto_alert.innerHTML = alert_success
        auto_generate_btn.innerHTML = "Generate"
        auto_generate_btn.classList.add('d-none')
        auto_fields_disabled(false)
        load_qs(1)
      })
      .catch(error => {
        console.error('Fetch error:', error)
        //optionally display error message to the user
        auto_alert.innerHTML = alert_failed
        auto_generate_btn.innerHTML = "Retry"
        auto_fields_disabled(false)
      })

  })

  let auto_next_qs = document.getElementById('auto-next-question')
  let end_game_after_wrong = document.getElementById('end-game')
  // let auto_pick_question = document.getElementById('auto-pick-question')
 
  document.getElementById('mode-control').addEventListener('click',() =>{
    document.getElementById('mode-control').checked?
    (
      end_game_after_wrong.disabled = true,
      end_game_after_wrong.checked = false,
      auto_next_qs.checked = false,
      auto_next_qs.disabled = true
    ):(
      end_game_after_wrong.disabled = false,
      end_game_after_wrong.checked = false,
      auto_next_qs.checked = false,
      auto_next_qs.disabled = false
    )
  })

  document.getElementById('no-of-questions')
    .addEventListener('input', ()=>{
      questionID.innerHTML = ""
      for(let i=1;i<=no_of_questions.value;i++){
      questionID.innerHTML += `<option>${i}</option>`
    }
    })

    document.getElementById('num-of-questions-btn')
    .addEventListener('click', ()=>{
      questionID.innerHTML = ""
      for(let i=1;i<=no_of_questions.value;i++){
      questionID.innerHTML += `<option>${i}</option>`
    }
    })
  
  questionID.addEventListener('change',()=>{
    load_qs(Number(questionID.value))
    if(questionID.value == 1) {
      previous_btn.disabled = true
      next_btn.disabled = false
    }

    if(questionID.value>1 || questionID.value < no_of_questions.value){
      previous_btn.disabled = false
      next_btn.disabled = false
    }

    if(questionID.value == no_of_questions.value){
      previous_btn.disabled = false
      next_btn.disabled = true
    }
  })

  next_btn.addEventListener("click", () => {
    let qs_format = {
      "question": null,
      "options": {
        "A": null,
        "B": null,
        "C": null,
        "D": null,
      },
      "answer": null,
    };

    qs_format.question = question.value;
    qs_format.options.A = option_a.value;
    qs_format.options.B = option_b.value;
    qs_format.options.C = option_c.value;
    qs_format.options.D = option_d.value;
    qs_format.answer = get_checked_option();
    let id = questionID.value
    questions_json[id] = qs_format;
 

    load_next();
    previous_btn.disabled = false;
  });

  previous_btn.addEventListener("click", () => {
    load_prev();
  });

  clear_field_btn.addEventListener('click',()=>{
    option_a.value = ""
    option_b.value = ""
    option_c.value = ""
    option_d.value = ""
    let marked_option = get_checked_option()
    option_radios[marked_option].checked = false
  })

  let submitted = false
  let submit_function = () => {
      let settings = {
      "timer": count_time.value,
      "number_of_questions": no_of_questions.value,
      "controls": show_controls.checked,
      "two_player_mode": document.getElementById('mode-control').checked,
      "end_game_after_wrong_answer": document.getElementById('end-game').checked,
      "show_scoreboard": document.getElementById('show-scoreboard').checked,
      "auto_next_question": auto_next_qs.checked
    }

    questions_json["settings"] = settings
    // console.log(questions_json)
    localStorage.setItem('wwtbam_qs',JSON.stringify(questions_json))
  }

  submit_btn.addEventListener('click',()=>{
    submit_function()
    submitted = true
  })

  play_btn.addEventListener('click',()=>{
    if(submitted == false) {
      submit_function()
    }

    console.log(Object.keys(questions_json).length, no_of_questions.value)
    if(Object.keys(questions_json).length >= no_of_questions.value) {
      window.open('/','_self')
    }  
  })

  let delete_btn = document.getElementById('delete-btn')
  delete_btn.addEventListener('click',()=>{
    let user_consent = confirm('Are you sure you want to delete your data?')
    if(user_consent == true){
        localStorage.removeItem('wwtbam_qs')
    }
    window.open('/settings.html', '_self')
  })
});

