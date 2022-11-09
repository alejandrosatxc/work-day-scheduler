function startClock() {
    $('#currentDay').text(dayjs().format("dddd, MMMM D h:mm:ss"))
    var ClockInterval = setInterval(function () {
        $('#currentDay').text(dayjs().format("dddd, MMMM D h:mm:ss"))
    }, 1000)
}

function initTimeBlocks() {
    //For a x hour workday, create x timeblocks
    var workDayHours = 10
    var newTimeblock = null
    var hour = null
    var textarea = null
    var saveButton = null
    //For each hour in the workday, insert a new timeblock
    for(var i = 0; i < workDayHours; i++) {
        newTimeblock = $('<div>').addClass('row justify-content-between time-block')
        hour = $('<div>').text(dayjs("2020-12-12 08:00:00").add(i, 'hour').format("h A")).addClass('hour')
        textarea = $('<textarea>').addClass('flex-grow-1')
        saveButton = $('<button>').addClass('save-btn')
        saveButton.append('<i class="fas fa-save"></i>')
        newTimeblock.append(hour).append(textarea).append(saveButton)
        $('.container').append(newTimeblock)
    }
}

startClock()
initTimeBlocks()