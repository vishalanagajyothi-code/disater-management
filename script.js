/* =====================================================
   D-MAS
   DISASTER MANAGEMENT & EMERGENCY ALERT SYSTEM
   FINAL script.js
   STEPS 15 - 24
   ===================================================== */


/* =====================================================
   PAGE NAVIGATION
   ===================================================== */

function openDashboard() {
    window.location.href = "dashboard.html";
}

function openAlert() {
    window.location.href = "alert.html";
}

function openMap() {
    window.location.href = "map.html";
}

function openShelters() {
    window.location.href = "shelters.html";
}

function openRescue() {
    window.location.href = "rescue.html";
}

function openReports() {
    window.location.href = "reports.html";
}

function openAdmin() {
    window.location.href = "admin.html";
}

function openAdminLogin() {
    window.location.href = "admin-login.html";
}

function goHome() {
    window.location.href = "index.html";
}

function navigateTo(page) {
    window.location.href = page;
}


/* =====================================================
   GET EMERGENCY REPORTS
   ===================================================== */

function getEmergencyReports() {

    try {

        var reports =
            JSON.parse(
                localStorage.getItem("disasterReports")
            );

        return Array.isArray(reports)
            ? reports
            : [];

    } catch (error) {

        console.error(
            "Error reading reports:",
            error
        );

        return [];
    }
}


/* =====================================================
   SAVE EMERGENCY REPORT
   ===================================================== */

function saveEmergencyReport(
    type,
    location,
    severity,
    description,
    contact
) {

    var report = {

        id: Date.now(),

        type: type || "Emergency",

        location: location || "Unknown",

        severity: severity || "Medium",

        description: description || "",

        contact: contact || "",

        date: new Date().toLocaleString(),

        status: "Under Investigation"

    };


    var reports =
        getEmergencyReports();


    reports.push(report);


    localStorage.setItem(
        "disasterReports",
        JSON.stringify(reports)
    );


    localStorage.setItem(
        "latestEmergencyId",
        String(report.id)
    );


    return report;
}


/* =====================================================
   EMERGENCY ICON
   ===================================================== */

function getEmergencyIcon(type) {

    if (!type) {
        return "🚨";
    }

    var value =
        String(type).toLowerCase();


    if (value.includes("flood")) {
        return "🌊";
    }

    if (value.includes("fire")) {
        return "🔥";
    }

    if (value.includes("cyclone")) {
        return "🌪️";
    }

    if (value.includes("earthquake")) {
        return "🌎";
    }

    if (value.includes("medical")) {
        return "🏥";
    }

    if (value.includes("storm")) {
        return "⛈️";
    }

    if (value.includes("electrical")) {
        return "⚡";
    }

    if (value.includes("industrial")) {
        return "🏭";
    }

    return "🚨";
}


/* =====================================================
   OPEN EMERGENCY DETAILS
   ===================================================== */

function openEmergencyDetails(id) {

    localStorage.setItem(
        "selectedEmergencyId",
        String(id)
    );

    window.location.href =
        "alert.html";
}


/* =====================================================
   DASHBOARD REPORTS
   ===================================================== */

function loadDashboardReports() {

    var tableBody =
        document.getElementById(
            "emergencyTableBody"
        );


    if (!tableBody) {
        return;
    }


    var reports =
        getEmergencyReports();


    tableBody.innerHTML = "";


    var activeCount =
        document.getElementById(
            "activeCount"
        );


    var activeReports =
        reports.filter(function (report) {

            return report.status !== "Resolved";

        });


    if (activeCount) {

        activeCount.innerText =
            activeReports.length;
    }


    if (reports.length === 0) {

        tableBody.innerHTML =
            '<tr>' +
            '<td colspan="5" style="text-align:center;padding:30px;">' +
            '📭 No emergency reports available.' +
            '</td>' +
            '</tr>';

        return;
    }


    reports
        .slice()
        .reverse()
        .forEach(function (report) {

            var row =
                document.createElement("tr");


            row.style.cursor =
                "pointer";


            row.onclick =
                function () {

                    openEmergencyDetails(
                        report.id
                    );

                };


            var severityClass =
                getSeverityClass(
                    report.severity
                );


            var statusClass =
                getStatusClass(
                    report.status
                );


            row.innerHTML =

                '<td>' +
                getEmergencyIcon(
                    report.type
                ) +
                ' ' +
                escapeHTML(
                    report.type ||
                    "Emergency"
                ) +
                '</td>' +

                '<td>' +
                escapeHTML(
                    report.location ||
                    "Unknown"
                ) +
                '</td>' +

                '<td>' +

                '<span class="severity ' +
                severityClass +
                '">' +

                escapeHTML(
                    report.severity ||
                    "Medium"
                ) +

                '</span>' +

                '</td>' +

                '<td>' +
                escapeHTML(
                    report.date ||
                    "Just now"
                ) +
                '</td>' +

                '<td>' +

                '<span class="status ' +
                statusClass +
                '">' +

                escapeHTML(
                    report.status ||
                    "Under Investigation"
                ) +

                '</span>' +

                '</td>';


            tableBody.appendChild(
                row
            );

        });


    updateDashboardStats();
}


/* =====================================================
   RECENT ALERTS
   ===================================================== */

function loadRecentAlerts() {

    var container =
        document.getElementById(
            "recentAlerts"
        );


    if (!container) {
        return;
    }


    var reports =
        getEmergencyReports();


    container.innerHTML = "";


    if (reports.length === 0) {

        container.innerHTML =
            '<div class="alert-item">' +

            '<div class="alert-icon">ℹ️</div>' +

            '<div>' +

            '<h3>No Emergency Reports</h3>' +

            '<p>New emergency reports will appear here.</p>' +

            '</div>' +

            '</div>';

        return;
    }


    reports
        .slice()
        .reverse()
        .slice(0, 3)
        .forEach(function (report) {

            var item =
                document.createElement(
                    "div"
                );


            item.className =
                "alert-item";


            item.style.cursor =
                "pointer";


            item.onclick =
                function () {

                    openEmergencyDetails(
                        report.id
                    );

                };


            item.innerHTML =

                '<div class="alert-icon">' +

                getEmergencyIcon(
                    report.type
                ) +

                '</div>' +

                '<div>' +

                '<h3>' +

                escapeHTML(
                    report.type ||
                    "Emergency"
                ) +

                ' Alert</h3>' +

                '<p>' +

                'Emergency reported at ' +

                escapeHTML(
                    report.location ||
                    "Unknown location"
                ) +

                '.</p>' +

                '<small>' +

                escapeHTML(
                    report.date ||
                    "Just now"
                ) +

                '</small>' +

                '</div>';


            container.appendChild(
                item
            );

        });
}


/* =====================================================
   ADMIN LOGIN
   ===================================================== */

function adminLogin(event) {

    if (event) {
        event.preventDefault();
    }


    var usernameInput =
        document.getElementById(
            "adminUsername"
        );


    var passwordInput =
        document.getElementById(
            "adminPassword"
        );


    var message =
        document.getElementById(
            "loginMessage"
        );


    if (
        !usernameInput ||
        !passwordInput
    ) {

        console.error(
            "Admin login fields not found."
        );

        return;
    }


    var username =
        usernameInput.value.trim();


    var password =
        passwordInput.value.trim();


    if (
        username === "admin" &&
        password === "1234"
    ) {

        sessionStorage.setItem(
            "adminLoggedIn",
            "true"
        );


        if (message) {

            message.style.color =
                "green";

            message.innerText =
                "✅ Login successful!";
        }


        setTimeout(function () {

            window.location.href =
                "admin.html";

        }, 300);


    } else {

        if (message) {

            message.style.color =
                "red";

            message.innerText =
                "❌ Invalid username or password.";
        }

    }
}


/* =====================================================
   CHECK ADMIN LOGIN
   ===================================================== */

function checkAdminLogin() {

    var loggedIn =
        sessionStorage.getItem(
            "adminLoggedIn"
        );


    if (loggedIn !== "true") {

        window.location.href =
            "admin-login.html";

        return false;
    }


    return true;
}


/* =====================================================
   ADMIN LOGOUT
   ===================================================== */

function adminLogout() {

    sessionStorage.removeItem(
        "adminLoggedIn"
    );


    window.location.href =
        "admin-login.html";
}


/* =====================================================
   ADMIN REPORT TABLE
   ===================================================== */

function renderAdminReports(reports) {

    var table =
        document.getElementById(
            "adminReportTable"
        );


    if (!table) {
        return;
    }


    table.innerHTML = "";


    if (reports.length === 0) {

        table.innerHTML =
            '<tr>' +

            '<td colspan="6" style="text-align:center;padding:30px;">' +

            '📭 No reports found.' +

            '</td>' +

            '</tr>';

        return;
    }


    reports
        .slice()
        .reverse()
        .forEach(function (report) {

            var row =
                document.createElement(
                    "tr"
                );


            var severityClass =
                getSeverityClass(
                    report.severity
                );


            var statusClass =
                getStatusClass(
                    report.status
                );


            row.innerHTML =

                '<td>' +

                getEmergencyIcon(
                    report.type
                ) +

                ' ' +

                escapeHTML(
                    report.type ||
                    "Emergency"
                ) +

                '</td>' +


                '<td>' +

                escapeHTML(
                    report.location ||
                    "Unknown"
                ) +

                '</td>' +


                '<td>' +

                '<span class="severity ' +
                severityClass +
                '">' +

                escapeHTML(
                    report.severity ||
                    "Medium"
                ) +

                '</span>' +

                '</td>' +


                '<td>' +

                escapeHTML(
                    report.date ||
                    "Just now"
                ) +

                '</td>' +


                '<td>' +

                '<span class="status ' +
                statusClass +
                '">' +

                escapeHTML(
                    report.status ||
                    "Under Investigation"
                ) +

                '</span>' +

                '</td>' +


                '<td>' +

                '<select onchange="updateReportStatus(' +
                Number(report.id) +
                ', this.value)">' +

                '<option value="Under Investigation"' +

                (
                    report.status ===
                    "Under Investigation"
                    ? " selected"
                    : ""
                ) +

                '>Under Investigation</option>' +


                '<option value="In Progress"' +

                (
                    report.status ===
                    "In Progress"
                    ? " selected"
                    : ""
                ) +

                '>In Progress</option>' +


                '<option value="Resolved"' +

                (
                    report.status ===
                    "Resolved"
                    ? " selected"
                    : ""
                ) +

                '>Resolved</option>' +

                '</select>' +

                '<button class="view-report-btn" ' +

                'onclick="viewAdminReport(' +
                Number(report.id) +
                ')">' +

                '👁 View' +

                '</button>' +

                '</td>';


            table.appendChild(
                row
            );

        });
}


/* =====================================================
   LOAD ADMIN REPORTS
   ===================================================== */

function loadAdminReports() {

    var table =
        document.getElementById(
            "adminReportTable"
        );


    if (!table) {
        return;
    }


    var reports =
        getEmergencyReports();


    renderAdminReports(
        reports
    );


    updateAdminStatistics(
        reports
    );
}


/* =====================================================
   STEP 15
   ACTIVE FILTER BUTTON
   ===================================================== */

function filterAdminReports(
    selectedStatus
) {

    var reports =
        getEmergencyReports();


    var filteredReports;


    if (
        selectedStatus === "All"
    ) {

        filteredReports =
            reports;

    } else {

        filteredReports =
            reports.filter(
                function (report) {

                    return report.status ===
                        selectedStatus;

                }
            );
    }


    renderAdminReports(
        filteredReports
    );


    var buttons =
        document.querySelectorAll(
            ".admin-filters button"
        );


    buttons.forEach(
        function (button) {

            button.classList.remove(
                "active-filter"
            );

        }
    );


    buttons.forEach(
        function (button) {

            if (
                button.innerText
                    .trim()
                    .includes(selectedStatus)
            ) {

                button.classList.add(
                    "active-filter"
                );

            }

        }
    );
}


/* =====================================================
   STEP 16
   ADMIN REPORT SEARCH
   ===================================================== */

function searchAdminReports() {

    var input =
        document.getElementById(
            "adminReportSearch"
        );


    if (!input) {
        return;
    }


    var searchValue =
        input.value
            .trim()
            .toLowerCase();


    var reports =
        getEmergencyReports();


    if (searchValue === "") {

        renderAdminReports(
            reports
        );

        return;
    }


    var filteredReports =
        reports.filter(
            function (report) {

                return (

                    String(
                        report.type || ""
                    )
                    .toLowerCase()
                    .includes(searchValue)

                    ||

                    String(
                        report.location || ""
                    )
                    .toLowerCase()
                    .includes(searchValue)

                    ||

                    String(
                        report.severity || ""
                    )
                    .toLowerCase()
                    .includes(searchValue)

                    ||

                    String(
                        report.status || ""
                    )
                    .toLowerCase()
                    .includes(searchValue)

                );

            }
        );


    renderAdminReports(
        filteredReports
    );
}


/* =====================================================
   STEP 17
   VIEW ADMIN REPORT DETAILS
   ===================================================== */

function viewAdminReport(id) {

    var reports =
        getEmergencyReports();


    var report =
        reports.find(
            function (item) {

                return String(item.id) ===
                    String(id);

            }
        );


    if (!report) {

        alert(
            "❌ Report not found."
        );

        return;
    }


    localStorage.setItem(
        "selectedEmergencyId",
        String(report.id)
    );


    window.location.href =
        "alert.html";
}


/* =====================================================
   STEP 18
   UPDATE REPORT STATUS
   ===================================================== */

function updateReportStatus(
    id,
    newStatus
) {

    var reports =
        getEmergencyReports();


    var found = false;


    reports.forEach(
        function (report) {

            if (
                String(report.id) ===
                String(id)
            ) {

                report.status =
                    newStatus;

                found = true;

            }

        }
    );


    if (!found) {

        alert(
            "❌ Report not found."
        );

        return;
    }


    localStorage.setItem(
        "disasterReports",
        JSON.stringify(reports)
    );


    loadAdminReports();

    loadDashboardReports();

    loadRecentAlerts();


    alert(
        "✅ Report status updated to: " +
        newStatus
    );
}


/* =====================================================
   STEP 19
   LIVE DASHBOARD STATISTICS
   ===================================================== */

function updateDashboardStats() {

    var reports =
        getEmergencyReports();


    var total =
        reports.length;


    var active =
        reports.filter(
            function (report) {

                return report.status !==
                    "Resolved";

            }
        ).length;


    var resolved =
        reports.filter(
            function (report) {

                return report.status ===
                    "Resolved";

            }
        ).length;


    var totalElement =
        document.getElementById(
            "totalReports"
        );


    var activeElement =
        document.getElementById(
            "activeReports"
        );


    var resolvedElement =
        document.getElementById(
            "resolvedReports"
        );


    if (totalElement) {
        totalElement.innerText =
            total;
    }


    if (activeElement) {
        activeElement.innerText =
            active;
    }


    if (resolvedElement) {
        resolvedElement.innerText =
            resolved;
    }


    var activeCount =
        document.getElementById(
            "activeCount"
        );


    if (activeCount) {
        activeCount.innerText =
            active;
    }
}


/* =====================================================
   ADMIN STATISTICS
   ===================================================== */

function updateAdminStats(
    total,
    active,
    resolved
) {

    var totalElement =
        document.getElementById(
            "totalReports"
        );


    var activeElement =
        document.getElementById(
            "activeReports"
        );


    var resolvedElement =
        document.getElementById(
            "resolvedReports"
        );


    if (totalElement) {

        totalElement.innerText =
            total;
    }


    if (activeElement) {

        activeElement.innerText =
            active;
    }


    if (resolvedElement) {

        resolvedElement.innerText =
            resolved;
    }
}


function updateAdminStatistics(
    reports
) {

    var total =
        reports.length;


    var active =
        reports.filter(
            function (report) {

                return report.status !==
                    "Resolved";

            }
        ).length;


    var resolved =
        reports.filter(
            function (report) {

                return report.status ===
                    "Resolved";

            }
        ).length;


    updateAdminStats(
        total,
        active,
        resolved
    );
}


/* =====================================================
   STEP 20
   HIGH SEVERITY EMERGENCY ALERT
   ===================================================== */
/* ================= HIGH SEVERITY ALERT ================= */

function checkHighSeverityAlerts() {

    var reports = getEmergencyReports();

    var highReports = reports.filter(function (report) {
        return String(report.severity).toLowerCase() === "high";
    });

    var alertBox = document.getElementById("highSeverityAlert");
    var alertMessage = document.getElementById("highSeverityMessage");
    var highCount = document.getElementById("adminHighSeverity");

    /* Update High Severity Count */

    if (highCount) {
        highCount.innerText = highReports.length;
    }

    /* Show alert */

    if (!alertBox) {
        return;
    }

    if (highReports.length > 0) {

        var latestHigh = highReports[highReports.length - 1];

        alertMessage.innerText =
            highReports.length +
            " high severity emergency report(s) require immediate attention. Latest: " +
            (latestHigh.type || "Emergency") +
            " at " +
            (latestHigh.location || "Unknown location");

        alertBox.style.display = "flex";

    } else {

        alertBox.style.display = "none";

    }
}


/* ================= CLOSE HIGH ALERT ================= */

function closeHighSeverityAlert() {

    var alertBox = document.getElementById("highSeverityAlert");

    if (alertBox) {
        alertBox.style.display = "none";
    }
}

/* =====================================================
   STEP 21
   SHELTER FILTERING
   ===================================================== */

function filterShelters(searchValue) {

    var cards = document.querySelectorAll(".shelter-card");

    var noResults =
        document.getElementById("noShelterResults");

    var searchText =
        String(searchValue || "")
        .toLowerCase()
        .trim();

    var visibleCount = 0;


    cards.forEach(function(card) {

        var cardText =
            card.innerText.toLowerCase();


        if (cardText.includes(searchText)) {

            card.style.display = "";

            visibleCount++;

        } else {

            card.style.display = "none";

        }

    });


    /* Show / Hide No Results */

    if (noResults) {

        if (visibleCount === 0) {

            noResults.style.display = "block";

        } else {

            noResults.style.display = "none";

        }

    }

}

/* =====================================================
   STEP 22
   RESCUE TEAM MANAGEMENT
   ===================================================== */

/* ================= RESCUE TEAM MANAGEMENT ================= */

function getRescueTeams() {

    var defaultTeams = [

        {
            name: "Alpha Rescue Team",
            status: "Available"
        },

        {
            name: "Bravo Rescue Team",
            status: "Busy"
        },

        {
            name: "Charlie Rescue Team",
            status: "On Mission"
        },

        {
            name: "Delta Rescue Team",
            status: "Available"
        }

    ];

    var saved =
        localStorage.getItem("rescueTeams");

    if (!saved) {

        localStorage.setItem(
            "rescueTeams",
            JSON.stringify(defaultTeams)
        );

        return defaultTeams;
    }

    try {

        return JSON.parse(saved);

    } catch (error) {

        return defaultTeams;

    }
}


/* ================= UPDATE STATUS ================= */

function updateRescueStatus(teamName, newStatus) {

    var teams = getRescueTeams();

    teams.forEach(function(team) {

        if (team.name === teamName) {

            team.status = newStatus;

        }

    });


    localStorage.setItem(
        "rescueTeams",
        JSON.stringify(teams)
    );


    updateRescueCard(
        teamName,
        newStatus
    );


    alert(
        teamName +
        " status updated to " +
        newStatus
    );

}


/* ================= UPDATE CARD ================= */

function updateRescueCard(teamName, status) {

    var cards =
        document.querySelectorAll(
            ".rescue-team-card"
        );


    cards.forEach(function(card) {

        var name =
            card.getAttribute("data-team");


        if (name !== teamName) {
            return;
        }


        var statusElement =
            card.querySelector(
                ".rescue-status"
            );


        if (!statusElement) {
            return;
        }


        statusElement.className =
            "rescue-status";


        if (status === "Available") {

            statusElement.classList.add(
                "available"
            );

            statusElement.innerText =
                "🟢 Available";

        }


        else if (status === "Busy") {

            statusElement.classList.add(
                "busy"
            );

            statusElement.innerText =
                "🟠 Busy";

        }


        else if (status === "On Mission") {

            statusElement.classList.add(
                "on-mission"
            );

            statusElement.innerText =
                "🔴 On Mission";

        }

    });

}


/* ================= SEARCH RESCUE TEAMS ================= */

function filterRescueTeams(searchValue) {

    var cards =
        document.querySelectorAll(
            ".rescue-team-card"
        );

    var searchText =
        String(searchValue || "")
        .toLowerCase()
        .trim();

    var visibleCount = 0;


    cards.forEach(function(card) {

        var text =
            card.innerText.toLowerCase();


        if (text.includes(searchText)) {

            card.style.display = "";

            visibleCount++;

        } else {

            card.style.display = "none";

        }

    });


    var noResults =
        document.getElementById(
            "noRescueResults"
        );


    if (noResults) {

        if (visibleCount === 0) {

            noResults.style.display =
                "block";

        } else {

            noResults.style.display =
                "none";

        }

    }

}

/* =====================================================
   STEP 23
   MAP SEARCH
   ===================================================== */


/* ================= MAP SEARCH ================= */

function searchMapLocation(searchValue) {

    var input =
        document.getElementById("mapSearch");

    var mapInfo =
        document.getElementById("mapInfo");

    var value;


    if (typeof searchValue === "string") {

        value = searchValue.trim();

    } else if (input) {

        value = input.value.trim();

    } else {

        value = "";

    }


    if (value === "") {

        mapInfo.innerHTML =
            "<h3>📍 Select a location</h3>" +
            "<p>Enter a location or click a marker.</p>";

        return;

    }


    var locations = [

        "Flood",
        "Fire",
        "Cyclone",
        "Government School",
        "Community Hall",
        "Relief Center",
        "Stadium Shelter",
        "Emergency Hospital",
        "Fire Station",
        "Police Station"

    ];


    var found = locations.find(function(location) {

        return location
            .toLowerCase()
            .includes(value.toLowerCase());

    });


    if (found) {

        showMarkerInfo(found);

    } else {

        mapInfo.innerHTML =
            "<h3>🔍 Location Not Found</h3>" +
            "<p>No matching location found for <strong>" +
            escapeHTML(value) +
            "</strong>.</p>";

    }

}


/* ================= MARKER INFORMATION ================= */

function showMarkerInfo(name) {

    var mapInfo =
        document.getElementById("mapInfo");


    if (!mapInfo) {
        return;
    }


    var information = "";


    /* -------- SHELTERS -------- */

    if (name === "Government School") {

        information =
            "<h3>🏫 Government School</h3>" +
            "<p>Safe Zone / Emergency Shelter</p>" +
            "<p>Capacity: <strong>500</strong></p>" +
            "<p>Occupied: <strong>320</strong></p>" +
            "<p>Available: <strong>180</strong></p>" +
            "<p>Distance: <strong>1.8 km</strong></p>" +
            "<p class='map-open'>● Open</p>";

    }


    else if (name === "Community Hall") {

        information =
            "<h3>🏢 Community Hall</h3>" +
            "<p>Safe Zone / Emergency Shelter</p>" +
            "<p>Capacity: <strong>300</strong></p>" +
            "<p>Occupied: <strong>260</strong></p>" +
            "<p>Available: <strong>40</strong></p>" +
            "<p>Distance: <strong>2.5 km</strong></p>" +
            "<p class='map-limited'>● Limited</p>";

    }


    else if (name === "Relief Center") {

        information =
            "<h3>🏥 Relief Center</h3>" +
            "<p>Safe Zone / Emergency Shelter</p>" +
            "<p>Capacity: <strong>200</strong></p>" +
            "<p>Occupied: <strong>180</strong></p>" +
            "<p>Available: <strong>20</strong></p>" +
            "<p>Distance: <strong>3.4 km</strong></p>" +
            "<p class='map-limited'>● Limited</p>";

    }


    else if (name === "Stadium Shelter") {

        information =
            "<h3>🏟️ Stadium Shelter</h3>" +
            "<p>Safe Zone / Emergency Shelter</p>" +
            "<p>Capacity: <strong>1000</strong></p>" +
            "<p>Occupied: <strong>450</strong></p>" +
            "<p>Available: <strong>550</strong></p>" +
            "<p>Distance: <strong>4.2 km</strong></p>" +
            "<p class='map-open'>● Open</p>";

    }


    /* -------- EMERGENCIES -------- */

    else if (name === "Flood") {

        information =
            "<h3>🌊 Flood Emergency</h3>" +
            "<p>Flood reported in this area.</p>" +
            "<p class='map-danger'>● High Risk</p>";

    }


    else if (name === "Fire") {

        information =
            "<h3>🔥 Fire Emergency</h3>" +
            "<p>Fire emergency reported.</p>" +
            "<p class='map-danger'>● High Risk</p>";

    }


    else if (name === "Cyclone") {

        information =
            "<h3>🌀 Cyclone Warning</h3>" +
            "<p>Cyclone warning area.</p>" +
            "<p class='map-warning'>● Medium Risk</p>";

    }


    /* -------- SERVICES -------- */

    else if (name === "Emergency Hospital") {

        information =
            "<h3>🏥 Emergency Hospital</h3>" +
            "<p>Emergency medical services available.</p>";

    }


    else if (name === "Fire Station") {

        information =
            "<h3>🚒 Fire Station</h3>" +
            "<p>Fire and rescue services available.</p>";

    }


    else if (name === "Police Station") {

        information =
            "<h3>👮 Police Station</h3>" +
            "<p>Police emergency services available.</p>";

    }


    else {

        information =
            "<h3>📍 Location</h3>" +
            "<p>" +
            escapeHTML(name) +
            "</p>";

    }


    mapInfo.innerHTML = information;


    highlightSelectedMarker(name);

}


/* ================= SELECTED MARKER ================= */

function highlightSelectedMarker(name) {

    var markers =
        document.querySelectorAll(
            ".map-marker"
        );


    markers.forEach(function(marker) {

        marker.classList.remove(
            "selected-shelter"
        );

        marker.classList.remove(
            "selected-marker"
        );

    });


    var markerId = "";


    if (name === "Government School") {

        markerId =
            "governmentSchoolMarker";

    }

    else if (name === "Community Hall") {

        markerId =
            "communityHallMarker";

    }

    else if (name === "Relief Center") {

        markerId =
            "reliefCenterMarker";

    }

    else if (name === "Stadium Shelter") {

        markerId =
            "stadiumShelterMarker";

    }

    else if (name === "Flood") {

        markerId =
            "floodMarker";

    }

    else if (name === "Fire") {

        markerId =
            "fireMarker";

    }

    else if (name === "Cyclone") {

        markerId =
            "cycloneMarker";

    }

    else if (name === "Emergency Hospital") {

        markerId =
            "hospitalMarker";

    }

    else if (name === "Fire Station") {

        markerId =
            "fireStationMarker";

    }

    else if (name === "Police Station") {

        markerId =
            "policeMarker";

    }


    if (markerId) {

        var marker =
            document.getElementById(markerId);


        if (marker) {

            marker.classList.add(
                "selected-marker"
            );

        }

    }

}


/* ================= USER LOCATION ================= */

function showUserLocation() {

    var user =
        document.getElementById(
            "userLocation"
        );


    var mapInfo =
        document.getElementById(
            "mapInfo"
        );


    if (user) {

        user.classList.add(
            "location-active"
        );

    }


    if (mapInfo) {

        mapInfo.innerHTML =
            "<h3>📍 Your Current Location</h3>" +
            "<p>Prototype location detected.</p>" +
            "<p>Select a nearby safe zone for navigation.</p>";

    }

}


/* ================= START NAVIGATION ================= */

function startNavigation() {

    var route =
        document.getElementById(
            "navigationRoute"
        );

    var mapInfo =
        document.getElementById(
            "mapInfo"
        );


    if (route) {

        route.classList.add(
            "route-active"
        );

    }


    if (mapInfo) {

        mapInfo.innerHTML +=
            "<div class='navigation-status'>" +
            "🚶 <strong>Navigation Started</strong>" +
            "<p>Prototype navigation route activated.</p>" +
            "</div>";

    }

}
    


/* =====================================================
   SHELTER LOCATION VIEW
   ===================================================== */

function openShelterFromLocation(
    name
) {

    localStorage.setItem(
        "selectedShelter",
        name
    );


    localStorage.setItem(
        "navigationMode",
        "view"
    );


    showMarkerInfo(
        name
    );
}


/* =====================================================
   STEP 24 - SHELTER NAVIGATION
===================================================== */


/* ================= SHELTER DATA ================= */

function getShelterData(name) {

    var shelters = {

        "Government School": {
            distance: "1.8 km",
            time: "5 min",
            marker: "governmentSchoolMarker"
        },

        "Community Hall": {
            distance: "2.5 km",
            time: "7 min",
            marker: "communityHallMarker"
        },

        "Relief Center": {
            distance: "3.4 km",
            time: "10 min",
            marker: "reliefCenterMarker"
        },

        "Stadium Shelter": {
            distance: "4.2 km",
            time: "12 min",
            marker: "stadiumShelterMarker"
        }

    };

    return shelters[name] || null;
}


/* ================= NAVIGATE TO SHELTER ================= */

function navigateToShelter(name) {

    var shelter =
        getShelterData(name);

    if (!shelter) {

        alert("Shelter information not found.");

        return;

    }


    /* Save destination */

    localStorage.setItem(
        "selectedShelter",
        name
    );

    localStorage.setItem(
        "navigationMode",
        "navigate"
    );


    /* Open map */

    window.location.href =
        "map.html";

}


/* ================= START SHELTER NAVIGATION ================= */

function startShelterNavigation(name) {

    var shelter =
        getShelterData(name);

    if (!shelter) {
        return;
    }


    var mapInfo =
        document.getElementById(
            "mapInfo"
        );

    var route =
        document.getElementById(
            "navigationRoute"
        );


    /* Highlight selected shelter */

    highlightSelectedMarker(name);


    /* Show route */

    if (route) {

        route.classList.add(
            "route-active"
        );

    }


    /* Show navigation information */

    if (mapInfo) {

        mapInfo.innerHTML =

            "<h3>🚶 Navigation Started</h3>" +

            "<p>" +
            "Destination: " +
            "<strong>" +
            escapeHTML(name) +
            "</strong>" +
            "</p>" +

            "<p>" +
            "📏 Distance: " +
            "<strong>" +
            shelter.distance +
            "</strong>" +
            "</p>" +

            "<p>" +
            "⏱️ Estimated Time: " +
            "<strong>" +
            shelter.time +
            "</strong>" +
            "</p>" +

            "<div class='navigation-status'>" +

            "🟢 Navigation Active" +

            "<p>" +
            "Follow the highlighted route " +
            "towards the selected shelter." +
            "</p>" +

            "</div>";

    }

}


/* ================= VIEW SHELTER ================= */

function openShelterFromLocation(name) {

    var shelter =
        getShelterData(name);


    localStorage.setItem(
        "selectedShelter",
        name
    );

    localStorage.setItem(
        "navigationMode",
        "view"
    );


    window.location.href =
        "map.html";

}


/* =====================================================
   STATUS CLASS
   ===================================================== */

function getStatusClass(
    status
) {

    if (!status) {
        return "investigation";
    }


    var value =
        String(status)
            .toLowerCase();


    if (
        value.includes("resolved")
    ) {

        return "resolved";
    }


    if (
        value.includes("progress")
    ) {

        return "progress";
    }


    return "investigation";
}


/* =====================================================
   EMERGENCY ALERT
   ===================================================== */

function showEmergencyAlert(
    message
) {

    alert(
        "🚨 EMERGENCY ALERT 🚨\n\n" +
        message +
        "\n\nPlease stay calm and follow safety instructions."
    );
}


function testEmergencyAlert() {

    showEmergencyAlert(
        "Emergency situation detected. " +
        "Please move to the nearest safe zone."
    );
}


/* =====================================================
   NOTIFICATION
   ===================================================== */

function sendNotification(
    message
) {

    alert(
        "🔔 EMERGENCY NOTIFICATION\n\n" +
        message
    );
}


/* =====================================================
   DATE & TIME
   ===================================================== */

function showDateTime(
    elementId
) {

    var element =
        document.getElementById(
            elementId
        );


    if (!element) {
        return;
    }


    element.innerText =
        new Date().toLocaleString();
}


/* =====================================================
   HTML SAFETY
   ===================================================== */

function escapeHTML(
    value
) {

    if (
        value === null ||
        value === undefined
    ) {

        return "";
    }


    return String(value)

        .replace(
            /&/g,
            "&amp;"
        )

        .replace(
            /</g,
            "&lt;"
        )

        .replace(
            />/g,
            "&gt;"
        )

        .replace(
            /"/g,
            "&quot;"
        )

        .replace(
            /'/g,
            "&#039;"
        );
}


/* =====================================================
   PAGE LOAD
   ===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        loadDashboardReports();

        loadRecentAlerts();

        loadAdminReports();

        updateDashboardStats();

        checkHighSeverityAlerts();

    }
);


/* =====================================================
   SYSTEM MESSAGE
   ===================================================== */

console.log(
    "🚨 D-MAS Steps 15-24 Loaded Successfully."
);