var scheduledEvents = []
var workDayHours = 8 //one timeblock for each hour in a workday
var workDayStartHour = 4 //pick and hour between 0-23

startClock()
initTimeBlocks()
//TODO: bug click donesnt work when clicking directly on save icon
$('.save-btn').on('click', saveScheduledEvent)


function startClock() {
    $('#currentDay').text(dayjs().format("dddd, MMMM D"))
    var ClockInterval = setInterval(function () {
        $('#currentDay').text(dayjs().format("dddd, MMMM D"))
    }, 1000)
}

function initTimeBlocks() {
    //For a x hour workday, create x timeblocks
    var newTimeblock = null
    var hour = null
    var textarea = null
    var saveButton = null
    //For each hour in the workday, insert a new timeblock
    for (var i = 0; i < workDayHours; i++) {
        //Create a timeblock using jquery
        newTimeblock = $('<div>').addClass('row justify-content-between time-block')
        newTimeblock.attr('data-hour', i)
        hour = $('<div>').text(dayjs().hour(workDayStartHour).add(i, 'hour').format("h A")).addClass('hour')
        textarea = $('<textarea>').addClass('flex-grow-1')
        //Apply a class to change textarea color based on the current time
        if(dayjs().hour()  >  (workDayStartHour + i)) { textarea.addClass('past')    }
        if(dayjs().hour() === (workDayStartHour + i)) { textarea.addClass('present') }
        if(dayjs().hour()  <  (workDayStartHour + i)) { textarea.addClass('future')  }
        saveButton = $('<button>').addClass('save-btn')
        saveButton.append('<i class="fas fa-save"></i>') //add fontawesome icon
        newTimeblock.append(hour).append(textarea).append(saveButton)
        //Append timeblock to main container
        $('.container').append(newTimeblock)
    }
    //Check localStorage if there are any scheduledEvents to load in
    loadScheduledEvents()
}

function saveScheduledEvent(e) {
    console.log('You clicked: ' + $(e.target).siblings('.hour').text() + " with value: " + $(e.target).siblings('textarea').val())
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
        for (var i in scheduledEvents) {
            console.log(scheduledEvents[i])
            $(timeBlocks[i]).val(scheduledEvents[i].text)
        }
    }
}