/*jslint browser: true*/
/*global $, jQuery, alert*/

$(document).ready(function () {

	//hides 'changes saved' message on document load.
	$("#changesSaved").hide();

	//displays firstname, lastname and booking reference localStorage values in the input fields.
	$("#fname").val() == localStorage.getItem("fname");
	$("#lname").val() == localStorage.getItem("lname");
	$("#bref").val() == localStorage.getItem("bref");

	//hides quote details part of form on document load.
	$("#additionalInfo").hide();

	//slide toggle feature to open/close form.
	$(".speech-bubble").click(function () {
		$("#formarea").slideToggle();
		$("#formarea").css("visibility", "visible");
		$(this).toggleClass("roundedBottom");
	});

	//localStorage accept or decline - stores data if user clicks accept/doesn't if they click decline and hides the footer onclick.
	if ($("#accept").on("click", function () {
			$("footer").css("visibility", "hidden");
			$("#submitBtn").on("click", function () {
				if (localStorage) {
					//LocalStorage is supported
					var fname = $("#fname").val();
					var lname = $("#lname").val();
					var bref = $("#bref").val();
					localStorage.setItem("fname", fname);
					localStorage.setItem("lname", lname);
					localStorage.setItem("bref", bref);

				}
			});
		}));

	$("#decline").on("click", function () {
		$("footer").css("visibility", "hidden");
	})

	// FUNCTIONS

	//validate first name input and display error message and red outline if invalid.
	function validateFname(x) {
		if (x == "") {
			$('input[id="fname"]').addClass("wronginput");
			$("#name1").text("Fields cannot be left blank.");
		} else if (!/[a-zA-Z]/.test(x)) {
			$('input[id="fname"]').addClass("wronginput");
			$("#name1").text("Name must only contain alphabetic characters.");
		} else {
			$('input[id="fname"]').removeClass("wronginput");
			$("#name1").text("");
			return true;
		}
	}

	//validate last name input and display error message and red outline if invalid.
	function validateLname(x) {
		if (x == "") {
			$('input[id="lname"]').addClass("wronginput");
			$("#name2").text("Fields cannot be left blank.");
		} else if (!/[a-zA-Z]/.test(x)) {
			$('input[id="lname"]').addClass("wronginput");
			$("#name2").text("Name must only contain alphabetic characters.");
		} else {
			$('input[id="lname"]').removeClass("wronginput");
			$("#name2").text("");
			return true;
		}
	}

	//validate booking reference input and display error message and red outline if invalid.
	function validateBookingRef(x) {
		if (x == "") {
			$('input[id="bref"]').addClass("wronginput");
			$("#book").text("Fields cannot be left blank.");
		} else if (/^[a-zA-Z]{3}[0-9]{6}/.test(x)) {
			$('input[id="bref"]').removeClass("wronginput");
			$("#book").text("");
			return true;
		} else {
			$("#book").text("Please enter a valid booking reference.");
		}
	}

	//checks if inputs have been left empty and outputs an error message if so.
	function checkEmpty(x) {
		while (x == "") {
			$("#leftblank").text("*Fields cannot be left blank.");
			return true;
		}

	}

	//checks if input fields contain only alphabetic characters.
	function alphaOnly(x) {
		if (/[a-zA-Z]/.test(x)) {
			return true;
		} else {
			alert("Field must only contain alphabetic characters.");
		}
	}

	//checks if input fields contain only numeric characters.
	function numberOnly(x) {
		if (/^\d+$/.test(x)) {
			return true;
		} else {
			alert("Field must only contain numeric characters.");
		}
	}

	//displays the quote details part of the form, disables the booking ref field and hides the 'Find your booking' button.
	function displayQuote() {
		$("#additionalInfo").show();
		$("#bref").attr("disabled", true);
		$("#submitBtn").hide();
		return true;
	}

	//click event to carry out validation checks and if true, calls displayQuote function.
	$("#submitBtn").on("click", function (e) {
		e.preventDefault();
		var fname = document.forms["myForm"]["fname"].value;
		var lname = document.forms["myForm"]["lname"].value;
		var bref = document.forms["myForm"]["bref"].value;
		validateFname(fname);
		validateLname(lname);
		validateBookingRef(bref);
		if (validateFname(fname) && validateLname(lname) && validateBookingRef(bref)) {
			displayQuote();

		}
	});

	//click event to carry out validation checks
	$("#savechanges").on("click", function (f) {
		f.preventDefault();
		var destination = document.forms["detailsForm"]["destination"].value;
		var deptdate = document.forms["detailsForm"]["deptdate"].value;
		var duration = document.forms["detailsForm"]["duration"].value;
		var partysize = document.forms["detailsForm"]["partysize"].value;
		var dairport = document.forms["detailsForm"]["dairport"].value;
		var aairport = document.forms["detailsForm"]["aairport"].value;

		//checks if fields are empty - if they are not then it carrys out alpha/numeric checks. 
		if (!checkEmpty(destination) && !checkEmpty(deptdate) && !checkEmpty(duration) && !checkEmpty(partysize) && !checkEmpty(dairport) && !checkEmpty(aairport)) {
			alphaOnly(destination);
			numberOnly(duration);
			numberOnly(partysize);
			alphaOnly(dairport);
			alphaOnly(aairport);

		}

		//if second round of checks return true (i.e. valid), hides the form and shows a div called changesSaved.
		if (alphaOnly(destination) && numberOnly(duration) && numberOnly(partysize) && alphaOnly(dairport) && alphaOnly(aairport)) {
			$("#myForm").hide();
			$(".speech-bubble").hide();
			$("#formarea").hide();
			$("#changesSaved").show();
		}

	});

	/* tool tip - code provided by © 2013, 2019 Xah Lee, http://xahlee.info/ */

	const hover = document.getElementById("hover");

	//creates tooltip element
	const toolTipBox = document.createElement("div");

	//style for tooltip
	toolTipBox.class = "toolTip1";
	toolTipBox.style.visibility = "hidden";
	toolTipBox.style.position = "fixed";
	toolTipBox.style.top = "1ex";
	toolTipBox.style.left = "1ex";
	toolTipBox.style.padding = "0.5em";
	toolTipBox.style.width = "10em";
	toolTipBox.style.borderRadius = "0.1em";
	toolTipBox.style.backgroundColor = "#939393";
	toolTipBox.style.color = "#fff";

	//insert into DOM
	document.body.appendChild(toolTipBox);

	const toolTipOn = ((evt) => {
		//get the position of the hover element
		const boundBox = evt.target.getBoundingClientRect();
		const coordX = boundBox.left;
		const coordY = boundBox.top;

		//adjust bubble position
		toolTipBox.style.left = (coordX + 40).toString() + "px";
		toolTipBox.style.top = (coordY + 40).toString() + "px";

		//add bubble content
		toolTipBox.innerHTML = "e.g. TLB123456";

		//make bubble visible
		toolTipBox.style.visibility = "visible";
	});

	var toolTipOff = (() => {
		toolTipBox.style.visibility = "hidden";
	});

	//event listeners for mouseover and mouseout to display tooltip accordingly.
	hover.addEventListener("mouseover", toolTipOn, false);
	hover.addEventListener("mouseout", toolTipOff, false);
	document.getElementById("hover").addEventListener("click", toolTipOff, false);


	//datepicker
	$("#deptdate").datepicker({
		dateFormat: 'dd/mm/yy',
		minDate: 0,
		onSelect: function (dateText) {
			$("#deptdate").datepicker('option', 'minDate', min);
		}
	});

	//AJAX

	//on click of submit button, takes value from bref input and matches it to relevant JSON object. Outputs the data from this object into the input elements of the form.
	$("#submitBtn").on("click", function () {
		var input = $("#bref").val();
		$.getJSON("scripts/index.json")
			.done(function (data) {
				console.log(data);
				$("#destination").val(data[input].destination);
				$("#deptdate").val(data[input].deptdate);
				$("#duration").val(data[input].duration);
				$("#partysize").val(data[input].partysize);
				$("#dairport").val(data[input].dairport);
				$("#aairport").val(data[input].aairport);

			})
			.fail(function () {
				alert("There was an error retrieving data from the server.");
			});
	});

	//outputs an acknowledgement message when user submits contact form.
	$("#submitContact").on("click", function (e) {
		e.preventDefault();
		$("#contactname").val("");
		$("#contactemail").val("");
		$("#query").val("");
		$("#thankYou").append("Thanks for getting in touch. We'll get back to you as soon as we can.");
	});
});
