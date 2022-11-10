//Global variables that are accessible in every function
var scheduledEvents = [] //array to hold saved and loaded scheduled events
var workDayHours = 8 //one timeblock for each hour in a workday
var workDayStartHour = 14 //pick and hour between 0-23

//First, start a clock, then create timeblocks, then add event listeners to buttons
startClock()
createTimeBlocks()
//TODO: bug click donesnt work when clicking directly on save icon
$('.save-btn').on('click', saveScheduledEvent)

//This function starts a clock and displays it in the header of the page
//Note: since the requirements only require day of the week, month, and day
//It is unecessary to use setInterval every second, since we are not 
//displaying seconds
function startClock() {
    $('#currentDay').text(dayjs().format("dddd, MMMM D"))
    var ClockInterval = setInterval(function () {
        $('#currentDay').text(dayjs().format("dddd, MMMM D"))
    }, 1000)
}

//This function dynamically creates timeblocks based on the number of workDayHours and
//The hour, workDayStartHour (0-23), at which the work day starts.
function createTimeBlocks() {
    
    //These variables will be used hold newly created elements that make up a timeblock
    var newTimeblock = null
    var hour = null
    var textarea = null
    var saveButton = null
    var currentHour = dayjs().hour() //use day.js to get the current hour as an integer(0-23)
    //For each hour in the workday, create a new timeblock
    for (var i = 0; i < workDayHours; i++) {
        //Create a div that represents a timeblock using jquery
        newTimeblock = $('<div>').addClass('row justify-content-between time-block')
        //We could also use id's here, however I felt better about using data attributes instead
        //of a bunch of different id's that look like id='1', id='2', id='3' etc...
        newTimeblock.attr('data-hour', i)
        //Create div that holds the hour
        //Use a mix of jQuery and Day.js to dynamically update the hour in each time block with proper formatting
        hour = $('<div>').text(dayjs().hour(workDayStartHour).add(i, 'hour').format("h A")).addClass('hour')
        //Create <textarea> for user input
        textarea = $('<textarea>').addClass('flex-grow-1')
        //Apply a class to change textarea color based on the current time
        if(currentHour  >  (workDayStartHour + i)) { textarea.addClass('past')    }
        if(currentHour === (workDayStartHour + i)) { textarea.addClass('present') }
        if(currentHour  <  (workDayStartHour + i)) { textarea.addClass('future')  }
        //Create a button to save user input to localStorage
        saveButton = $('<button>').addClass('save-btn')
        saveButton.append('<i class="fas fa-save"></i>') //add fontawesome icon
        //Append all of the newly created elements inside a timeblock element
        newTimeblock.append(hour).append(textarea).append(saveButton)
        //Append timeblock to main container
        $('.container').append(newTimeblock)
    }
    //Check localStorage if there are any scheduledEvents to load in
    loadScheduledEvents()
}

//This function creates an object (scheduledEvent) to store user input, 
//then inserts that object into the global array of scheduled events
//then saves that array into localStorage using the name 'scheduledEvents'
function saveScheduledEvent(e) {
    //Create an event to store user input 'text' 
    var scheduledEvent = {
        time: $(e.target).siblings('.hour').text(),
        text: $(e.target).siblings('textarea').val()
    }
    //Get an index by reading the data-hour attribute value from the parent timeblock element
    var index = $(e.target).parent().data('hour')
    //Use that index to 'replace' the old scheduledEvent in that time slot with a new one
    scheduledEvents[index] = scheduledEvent
    //Save newly updated array of scheduled events to localStorage
    localStorage.setItem("scheduledEvents", JSON.stringify(scheduledEvents))
}

//This function checks localStorage for 'scheduledEvents'
//If it finds some, it will load in the data into each timeblock
//Otherwise, it fills the global array of scheduled events with placeholder objects
function loadScheduledEvents() {
    //Read from localStorage
    scheduledEvents = localStorage.getItem('scheduledEvents')

    //If there are not previoud scheduled events in localStorage
    if (!scheduledEvents) {
        //Set the global array of scheduledEvents to be empty
        scheduledEvents = []
        for (var i = 0; i < workDayHours; i++) {
            //Push an empty scheduledEvent object into the array
            //The purpose of this is to create indexes in our global array
            //So that the program can overwrite data at certain time slots
            scheduledEvents[i] = {
                time: dayjs("2020-12-12 08:00:00").add(i, 'hour').format("h A"),
                text: ""
            }
        }
    } else { //Otherwise parse the array of scheduled events and inject data into timeblocks
        scheduledEvents = JSON.parse(scheduledEvents)
        //Target all textareas in timeblocks
        var timeBlocks = $('textarea')
        //for each textarea, change the text in it to what was saved in localStorage
        for (var i in scheduledEvents) {
            $(timeBlocks[i]).val(scheduledEvents[i].text)
        }
    }
}