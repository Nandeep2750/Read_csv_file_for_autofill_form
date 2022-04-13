$(function () {
    var toast = new iqwerty.toast.Toast();

    var total_count = 0;
    var all_data = [];
    var current_count = 0;

    function setNextData(params) {
        let current_content = all_data[current_count].split(",");

        $('#vName').val(current_content[0])
        $('#vEmail').val(current_content[1])
        $('#vContactNo').val(current_content[2])
    }

    function reset_form_element(e) {
        e.wrap('<form>').parent('form').trigger('reset');
        e.unwrap();
    }

    $('#csvUpload').change(function (e) {
        var ext = this.value.match(/\.(.+)$/)[1];
        var ext = ext.toLowerCase();

        var selectedFile = e.target.files[0];

        if (ext) {
            if ($.inArray(ext, ['csv']) == -1) {
                toast.setText('Please upload csv!').stylize({ background: '#dc3545', color: 'black', 'box-shadow': '0 0 50px rgba(0, 0, 0, .7)' }).show();
            } else {
                $('label[for="' + $(this).attr('id') + '"]').html(selectedFile.name);

                var myReader = new FileReader();

                //check if browser support FileReader
                if (typeof (FileReader) != "undefined") {
                    //create html5 file reader object
                    var myReader = new FileReader();
                    // call filereader. onload function
                    myReader.onload = function (e) {

                        var content = myReader.result;
                        //split csv file using "\n" for new line (each row)
                        var lines = content.split("\n");
                        total_count = lines.length - 1

                        all_data = lines;

                        current_count = current_count + 1
                        setNextData()
                        $("#sample-form").valid();

                    }
                    //call file reader onload
                    myReader.readAsText(selectedFile);
                }
                else {
                    alert("This browser does not support HTML5.");
                }
            }
        }
    });

    $("#sample-form").validate({
        rules: {
            vName: {
                required: true
            },
            vEmail: {
                required: true,
                email: true,
            },
            vContactNo: {
                required: true
            },
        },
        messages: {
            vName: "Please enter Name",
            vEmail: {
                required: "Please enter a Email",
                email: "Please enter valid Email"
            },
            vContactNo: "Please enter Contact number",
        },
        submitHandler: function (form, event) {

            let vName = $('#vName').val();
            let vEmail = $('#vEmail').val();
            let vContactNo = $('#vContactNo').val();

            let row = document.createElement("tr");

            let cellElement_Name = document.createElement("td");
            let cellContent_Name = document.createTextNode(vName);
            cellElement_Name.appendChild(cellContent_Name);
            row.appendChild(cellElement_Name);

            let cellElement_Email = document.createElement("td");
            let cellContent_Email = document.createTextNode(vEmail);
            cellElement_Email.appendChild(cellContent_Email);
            row.appendChild(cellElement_Email);

            let cellElement_ContactNo = document.createElement("td");
            let cellContent_ContactNo = document.createTextNode(vContactNo);
            cellElement_ContactNo.appendChild(cellContent_ContactNo);
            row.appendChild(cellElement_ContactNo);

            // $('#outputTable-body').appendChild(row);
            $("#outputTable-body").append(row);

            current_count = current_count + 1

            if (total_count < current_count) {

                reset_form_element($('#csvUpload'));
                $('label[for="csvUpload"]').html('Choose CSV file...');


                toast.setText('All data has been submitted!').stylize({ background: '#28a745', color: 'black', 'box-shadow': '0 0 50px rgba(0, 0, 0, .7)' }).show();

                $('#vName').val('');
                $('#vEmail').val('');
                $('#vContactNo').val('');

                total_count = 0;
                all_data = [];
                current_count = 0;

            } else {
                setNextData()
            }

            return false;
        },
    });
});
