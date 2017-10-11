function prettyDate (date) {
    var months = ["jan", "feb", "mar", "apr", "may", "jun",
      "jul", "aug", "sep", "oct", "nov", "dec"
    ];
  
    return date.substr(8, 2) + months[parseInt(date.substr(5, 2) - 1)];
}

module.exports = prettyDate