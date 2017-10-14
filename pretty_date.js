function prettyDate (date) {
  var months = ["January", "February", "March", "April", "May", "Jun",
    "July", "August", "September", "October", "November", "December"
  ];

  return months[parseInt(date.substr(5, 2) - 1)].toUpperCase() + " " + date.substr(8, 2);
}

module.exports = prettyDate