/*header title*/
document.querySelector(".header-title").textContent =
    "CS 302 · Automata Theory and Formal Languages";
    

const csvInput = document.getElementById("csvInput");
const analyzeBtn = document.getElementById("analyzeBtn");
const clearBtn = document.getElementById("clearBtn");
const loadSample = document.getElementById("loadSample");

const results = document.getElementById("results");
const output = document.getElementById("output");

// Load sample CSV
loadSample.addEventListener("click", function () {
    csvInput.value = '"Ana",20,"Hello, World"\n"John",21,"Computer Science"';
});

// Clear input and results
clearBtn.addEventListener("click", function () {
    csvInput.value = "";
    output.innerHTML = "<p>Analysis results will appear here.</p>";
    results.classList.remove("show");
});

// Analyze CSV
analyzeBtn.addEventListener("click", function () {

    const text = csvInput.value;

    results.classList.add("show");

    if (text.trim() === "") {
        output.innerHTML = '<p class="error">Please enter CSV data.</p>';
        return;
    }

    const tokens = [];
    let field = "";
    let insideQuotes = false;
    let afterQuote = false;
    let errors = [];

    for (let i = 0; i < text.length; i++) {

        const char = text[i];

        if (insideQuotes) {

            if (char === '"') {

                if (text[i + 1] === '"') {
                    field += '"';
                    i++;
                } else {
                    insideQuotes = false;
                    afterQuote = true;
                }

            } else {
                field += char;
            }

        } else {

            if (afterQuote) {

                if (char === ",") {
                    tokens.push({
                        type: "QUOTED_FIELD",
                        value: field
                    });

                    field = "";
                    afterQuote = false;

                } else if (char === "\n" || char === "\r") {
                    tokens.push({
                        type: "QUOTED_FIELD",
                        value: field
                    });

                    field = "";
                    afterQuote = false;

                    if (char === "\r" && text[i + 1] === "\n") {
                        i++;
                    }

                } else {
                    errors.push(
                        `Unexpected character after closing quote at position ${i + 1}.`
                    );
                    break;
                }

            } else if (char === '"') {

                if (field.length === 0) {
                    insideQuotes = true;
                } else {
                    errors.push(
                        `Unexpected quotation mark at position ${i + 1}.`
                    );
                    break;
                }

            } else if (char === ",") {

                tokens.push({
                    type: "FIELD",
                    value: field
                });

                field = "";

            } else if (char === "\n" || char === "\r") {

                tokens.push({
                    type: "FIELD",
                    value: field
                });

                field = "";

                if (char === "\r" && text[i + 1] === "\n") {
                    i++;
                }

            } else {
                field += char;
            }
        }
    }

    // Check remaining field
    if (insideQuotes) {
        errors.push("Unclosed quotation mark.");
    } else if (!errors.length) {
        tokens.push({
            type: afterQuote ? "QUOTED_FIELD" : "FIELD",
            value: field
        });
    }

    // Display results
    let html = "";

    if (errors.length > 0) {

        html += '<p class="error">LEXICAL ERROR DETECTED</p>';

        errors.forEach(error => {
            html += `<div class="result-item error">${error}</div>`;
        });

    } else {

        html += '<p class="success">CSV ANALYSIS SUCCESSFUL!</p>';

        html += `<p>Total Tokens: ${tokens.length}</p>`;

        tokens.forEach((token, index) => {
            html += `
                <div class="result-item">
                    <strong>Token ${index + 1}: ${token.type}</strong>
                    <br>
                    Value: ${escapeHTML(token.value)}
                </div>
            `;
        });
    }

    output.innerHTML = html;

});

// Safely display user-provided text
function escapeHTML(value) {
    return value.replace(/[&<>"']/g, function (char) {
        return {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#039;"
        }[char];
    });
}

/*footer content*/
document.querySelector(".footer-content").innerHTML =
    "<p>&copy; 2026 CSV Lexical Analyzer MCO.</p>";

