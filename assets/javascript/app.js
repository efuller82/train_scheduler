  // Your web app's Firebase configuration
  var firebaseConfig = {
    apiKey: "AIzaSyD2BEuc9QNWR-l-RkyhLlq8XFmAM_3JM6I",
    authDomain: "train-scheduler-a335d.firebaseapp.com",
    databaseURL: "https://train-scheduler-a335d.firebaseio.com",
    projectId: "train-scheduler-a335d",
    storageBucket: "train-scheduler-a335d.appspot.com",
    messagingSenderId: "122541575451",
    appId: "1:122541575451:web:0f393d077c5faba8"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  var database = firebase.database();

  // Button for adding trains
  $("#add-train-btn").on("click", function(event) {
      event.preventDefault();

      // Grabs user input
      var trainName = $("#train-name").val().trim();
      var trainDestination = $("#destination").val().trim();
      var firstTrain = $("#first-train").val().trim();
      var trainFrequency = $("#frequency").val().trim();

      // Creates local "temporary" object for holding employee data
      var newTrain = {
          train : trainName,
          where : trainDestination,
          when: firstTrain,
          frequency: trainFrequency
      };

      // Uploads employee data to the database
      database.ref().push(newTrain);

      // Logs everything to the console
      console.log(newTrain.train);
      console.log(newTrain.where);
      console.log(newTrain.when);
      console.log(newTrain.frequency);

      alert("Train successfully added");

      // Clears all of the text-boxes
      $("#train-name").val("");
      $("#destination").val("");
      $("#first-train").val("");
      $("#frequency").val("");
  });

  // 3. Create Firebase event for adding employee to the db and a row in the html when a user is added
  database.ref().on("child_added", function(childSnapshot) {
      console.log(childSnapshot.val());

      // Store everything into a variable.
      var trainName = childSnapshot.val().train;
      var trainDestination = childSnapshot.val().where;
      var firstTrain = childSnapshot.val().when;
      var trainFrequency = childSnapshot.val().frequency;

      // Train info
      console.log(trainName);
      console.log(trainDestination);
      console.log(firstTrain);
      console.log(trainFrequency);

      
      // Calculate when the next arrival will be
      // Will have to use the time of the first train and the train frequency, as well as the current time
      // Prettify the next train arrival in military time
      var convertedTime = moment(firstTrain, "HH:mm").subtract(1, "years");
      console.log(convertedTime);

      var diffTime = moment().diff(moment(convertedTime), "minutes");  
      console.log("Difference in time: " + diffTime);

      var tRemainder = diffTime % trainFrequency;
      console.log(tRemainder);

      // Calculate how many minutes away the next train is
      // Will have to use next arrival - current time
      var now = moment();
      var minutesAway = trainFrequency - tRemainder;

      // Next arrival
      var nextArrival = moment().add(minutesAway, "minutes");
      console.log("Arrival Time: " + moment(nextArrival).format("HH:mm"));

      // Create the new row
      var newRow = $("<tr>").append(
          $("<td>").text(trainName),
          $("<td>").text(trainDestination),
          $("<td>").text(trainFrequency),
          $("<td>").text(nextArrival.format("HH:mm")),
          $("<td>").text(minutesAway)
      );

      //Append the new row to the table
      $("#train-schedule-table > tbody").append(newRow);
  });