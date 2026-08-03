let students = [];

function addStudent() {

    let name = document.getElementById("name").value;

    let total =
        Number(document.getElementById("dsa").value)+
        Number(document.getElementById("dbms").value)+
        Number(document.getElementById("dlco").value)+
        Number(document.getElementById("java").value)+
        Number(document.getElementById("m3").value);

    let per = total / 5;

    students.push({
        name: name,
        total: total,
        per: per
    });

    students.sort(function(a, b) {
        return b.per - a.per;
    });

    document.getElementById("result").innerHTML = "";

    for (let i = 0; i < students.length; i++) {

        document.getElementById("result").innerHTML +=
        "<tr>" +
        "<td>" + students[i].name + "</td>" +
        "<td>" + students[i].total + "</td>" +
        "<td>" + students[i].per.toFixed(2) + "%</td>" +
        "</tr>";
    }

    document.getElementById("topper").innerHTML =
    "Topper : " + students[0].name + " (" + students[0].per.toFixed(2) + "%)";
}