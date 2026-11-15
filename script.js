  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

  // Helper to add minutes to a "HH:MM" string
  function addMinutes(timeStr, minsToAdd) {
    let [hours, mins] = timeStr.split(':').map(Number);
    let totalMins = hours * 60 + mins + minsToAdd;
    let newHours = Math.floor(totalMins / 60) % 24;
    let newMins = totalMins % 60;
    return `${String(newHours).padStart(2, '0')}:${String(newMins).padStart(2, '0')}`;
  }

  // Fisher-Yates Shuffle Algorithm
  function shuffleArray(array) {
    let arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  function generateTimetable() {
    const rawSubjects = document.getElementById('subjects').value;
    const subjects = rawSubjects.split(',').map(s => s.trim()).filter(s => s !== "");
    
    if (subjects.length < 5) {
      alert("Please enter at least 5 subjects.");
      return;
    }

    let currentTime = document.getElementById('startTime').value;
    const duration = parseInt(document.getElementById('periodDuration').value);
    const periodsCount = parseInt(document.getElementById('periodsPerDay').value);
    const breakAfter = parseInt(document.getElementById('breakAfter').value);
    const breakDuration = 30; // 30-minute break

    // Build daily schedules avoiding immediate consecutive repeats
    let weeklySchedule = days.map(() => {
      let daySubjects = [];
      let pool = shuffleArray(subjects);
      
      for (let p = 0; p < periodsCount; p++) {
        if (pool.length === 0) {
          pool = shuffleArray(subjects);
          // Prevent the last subject of the previous pool from repeating immediately
          if (daySubjects.length > 0 && pool[0] === daySubjects[daySubjects.length - 1]) {
            pool.push(pool.shift());
          }
        }
        daySubjects.push(pool.shift());
      }
      return daySubjects;
    });

    // Construct the HTML Table
    let html = `<table><thead><tr><th>Time</th>`;
    days.forEach(day => html += `<th>${day}</th>`);
    html += `</tr></thead><tbody>`;

    for (let p = 0; p < periodsCount; p++) {
      // Insert Break Row if configured
      if (p === breakAfter) {
        let breakEnd = addMinutes(currentTime, breakDuration);
        html += `<tr class="break-row">
                   <td>${currentTime} - ${breakEnd}</td>
                   <td colspan="${days.length}">BREAK TIME</td>
                 </tr>`;
        currentTime = breakEnd;
      }

      let nextTime = addMinutes(currentTime, duration);
      html += `<tr><td><strong>${currentTime} - ${nextTime}</strong></td>`;
      
      for (let d = 0; d < days.length; d++) {
        html += `<td>${weeklySchedule[d][p]}</td>`;
      }
      
      html += `</tr>`;
      currentTime = nextTime;
    }

    html += `</tbody></table>`;
    document.getElementById('timetableContainer').innerHTML = html;
  }

  // Generate an initial timetable on page load
  window.onload = generateTimetable;