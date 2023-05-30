// Hard-coded scores
var grades = [65.95, 56.98, 78.62, 96.1, 90.3, 72.24, 92.34, 60.00, 81.43, 86.22, 88.33, 9.03,
    49.93, 52.34, 53.11, 50.10, 88.88, 55.32, 55.69, 61.68, 70.44, 70.54, 90.0, 71.11, 80.01];

var letterGrades = ['ap', 'a', 'am', 'bp', 'b', 'bm', 'cp', 'c', 'cm', 'd', 'f'];


// Generates a new histogram given the lower bounds for each grade
function generateHistogram() {
    // Store each score in its corresponding grade using 2D array
    var placements = [];
    for (var b = 0; b < 12; b++) {
        placements[b] = [];
    }

    // Get all bounds and store in an array
    var inputs = document.querySelectorAll("td > input");
    var bounds = [];
    for (var a = 0; a < inputs.length; a++) {
        bounds[a] = inputs[a].value * 1;
    }

    // Before creating a histogram, check if the bounds are valid
    var prevBound = bounds[0];
    for (var h = 0; h < 12; h++) {
        // Check if bound is a valid number
        if (isNaN(bounds[h])) {
            document.getElementById("errorMsg").innerHTML = "BoundError: Enter a valid number for the lower bounds"
            showError();
            return;
        }
        else { hideError(); }
        // Check if there are any overlaps
        if (bounds[h] > prevBound) {
            document.getElementById("errorMsg").innerHTML = "BoundError: Overlapping of values in lower bounds"
            showError();
            return;
        }
        else { hideError; }
        // Check for large/negative values
        if (bounds[h] > 100 || bounds[h] < 0) {
            document.getElementById("errorMsg").innerHTML = "BoundError: Enter values between 0 and 100"
            showError();
            return;
        }
        else { hideError(); }
        // Update the previous bound for the next bound check
        // NOTE: Can only check previous bounds after first iteration completed
        if (h != 0) {
            prevBound = bounds[h];
        }
    };

    // For every grade, find where it fits
    for (var i = 0; i < grades.length; i++) {
        // Check in reverse order-- if grade doesn't fit in C-, check C, then C+, etc
        var j = 10;
        while (j >= 0) {
            // Ex. If grade is greater than B but less than B+, store as a B grade
            if (bounds[j+1] <= grades[i] && grades[i] < bounds[j]) {
                placements[j+1].push(grades[i]);
            }
            // Edge case when percent is equal to max (in this case, put in A+ grade)
            else if ((j == 0) && (grades[i] == bounds[0])) {
                placements[1].push(grades[i]);
            }
            // Go to next grade
            j--;
        }
    }
    
    // Display values inside histogram
    letterGrades.forEach(letter => {
        var count = placements[letterGrades.indexOf(letter)+1].length;
        var string = "";
        for (var k = 0; k < count; k++) {
            string = string.concat("O");
        }
        document.getElementById(letter).innerHTML = string;
    });
}

function addGrade() {
    var newGrade = document.getElementById("addInput").value;
    // Catch unwanted formats
    if (isNaN(newGrade) || newGrade > 100 || newGrade < 0 || newGrade == null || newGrade == "") {
        document.getElementById("errorMsg").innerHTML = "NewGradeError: Must be a valid number between 0 and 100";
        document.querySelector("#box4").style.backgroundColor = "rgb(233, 200, 200)";
        document.querySelector("#errorMsg").style.color = "rgb(189,66,48)";
        return;
    }
    hideError();
    newGrade = newGrade * 1;
    grades.push(newGrade);
    generateHistogram();
}

// Functions for displaying error box
function showError() {
    document.querySelector("#box4").style.backgroundColor = "rgb(233, 200, 200)";
    document.querySelector("#errorMsg").style.color = "rgb(189,66,48)";
    // Hide histogram if error detected
    letterGrades.forEach(letter => {
        document.getElementById(letter).innerHTML = "";
    });
}
  
function hideError() {
    document.getElementById("errorMsg").innerHTML = "No errors detected"
    document.querySelector("#box4").style.backgroundColor = "rgb(233, 239, 241)";
    document.querySelector("#errorMsg").style.color = "#000000";
}

// Event listeners for bound adjustments
var inputbox = document.querySelectorAll("td > input");
inputbox.forEach(box => {
    box.addEventListener('change', generateHistogram);
});
