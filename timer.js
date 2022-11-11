// Grabbing Elements for manipulation
const form_container = document.querySelector('.form-container');
const countdown_container = document.querySelector('.countdown-container');
const timers = document.querySelectorAll('.timers span');
const complete_container = document.querySelector('.complete-container');

// some global variables
let countdown_date = '';
let countdown_title = '';
let countdown_time = Date;
const second = 1000;
const minute = 60 * second;
const hour = 60 * minute;
const day = 24 * hour;
let dynamic_count;

// to avoid user being able to pick from past dates
const select_current_date = () => {
    const standard_time = new Date().toISOString().split('T');
    // letting user select only from current date
    form_container.children[1].children[3].setAttribute('min', standard_time[0]);
}

select_current_date();

// to check if the numbers are less that 10, add 0 to start
const check_time = (time) => {
    if (time.textContent < 10)  time.textContent = `0${time.textContent}`;
}

// some math to get current and future time difference and populate it in the DOM
const updateDOM = () => {
    if (countdown_date === '') {
        alert('Pls, select a valid date...');        
    } else {
        dynamic_count = setInterval(() => {
            // some computation to get time amount from set future date to moment
            const date_set = new Date(countdown_date).getTime();
            const today = new Date().getTime();
            countdown_time = date_set - today;

            // populate the computed time in the DOM
            countdown_container.children[0].textContent = countdown_title;
            // Day(s)
            timers[0].textContent = Math.floor(countdown_time / day);
            timers[0].textContent < 2 ? timers[0].parentElement.children[1].textContent = 'DAY' : timers[0].parentElement.children[1].textContent = 'DAYS';
            // Hours
            timers[1].textContent = Math.floor((countdown_time % day) / hour);
            timers[1].textContent < 2 ? timers[1].parentElement.children[1].textContent = 'HOUR' : timers[1].parentElement.children[1].textContent = 'HOURS';
            check_time(timers[1]);
            // Minutes
            timers[2].textContent = Math.floor((countdown_time % hour) / minute);
            timers[2].textContent < 2 ? timers[2].parentElement.children[1].textContent = 'MINUTE' : timers[2].parentElement.children[1].textContent = 'MINUTES';
            check_time(timers[2]);
            // Seconds
            timers[3].textContent = Math.floor((countdown_time % minute) / second);
            timers[3].textContent < 2 ? timers[3].parentElement.children[1].textContent = 'SECOND' : timers[3].parentElement.children[1].textContent = 'SECONDS';
            check_time(timers[3]);

            // then we want the countdown window to show to start countdown
            form_container.hidden = true;
            countdown_container.hidden = false;
            
            // to check if the set date is equal to today's date / when the countdown hits zero
            if (countdown_time <= 0) {
                clearInterval(dynamic_count);
                complete_container.children[1].textContent = `${countdown_title} finished on ${countdown_date}`;
                // to play music like alarm on countdown completion
                complete_container.children[3].load();
                complete_container.children[3].play();
                // display countdown complete screen and hide others
                countdown_container.hidden = true;
                form_container.hidden = true;
                complete_container.hidden = false;
            }
        }, second);
    }
}

// fetching date data
const get_date = (e) => {
    e.preventDefault();
    countdown_title = e.srcElement[0].value;
    countdown_date = e.srcElement[1].value;
    // storing in localStorage for continuous access even after page refresh
    const store_countdown_data = { date: countdown_date, title: countdown_title};
    localStorage.setItem('countdown-data', JSON.stringify(store_countdown_data));

    updateDOM();
}

const reset = () => {
    // stop countdown
    clearInterval(dynamic_count);
    // clear form inputs
    form_container.children[1].children[1].value = '';
    form_container.children[1].children[3].value = '';
    // clear localStorage if there's any data stored
    localStorage.removeItem('countdown-data');
    // to stop playing music like alarm
    complete_container.children[3].pause();
    // hide countdown_container and show form_container
    countdown_container.hidden = true;
    complete_container.hidden = true;
    form_container.hidden = false;
}

// Event Listeners
form_container.children[1].addEventListener('submit', get_date);
countdown_container.children[2].addEventListener('click', reset);
complete_container.children[2].addEventListener('click', reset);

// To continue already-set countdown On Load
if (localStorage) {
    try {
        const stored_countdown_data = JSON.parse(localStorage.getItem('countdown-data'));
        countdown_date = stored_countdown_data.date;
        countdown_title = stored_countdown_data.title;
        updateDOM();
    } catch (error) {
        console.log('No data found in localStorage');
    }
};