const calculateGrade = (marks) => {

  if (marks >= 90 && marks <= 100) {
    return "O";
  }

  if (marks >= 80 && marks < 90) {
    return "E";
  }

  if (marks >= 70 && marks < 80) {
    return "A";
  }

  if (marks >= 60 && marks < 70) {
    return "B";
  }

  if (marks >= 50 && marks < 60) {
    return "C";
  }

  if (marks >= 35 && marks < 50) {
    return "D";
  }

  return "F";
};

module.exports = calculateGrade;