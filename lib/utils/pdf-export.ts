import type { InterviewAnalysis, Interview } from '@/types/interview'
import { formatDate, formatDuration } from './format'

export async function generatePDF(
  interview: Interview,
  analysis: InterviewAnalysis
): Promise<void> {
  // Create a printable HTML version
  const printWindow = window.open('', '_blank')
  if (!printWindow) {
    alert('Please allow popups to export PDF')
    return
  }

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Interview Analysis Report - ${interview.title}</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          padding: 40px;
          color: #1f2937;
          line-height: 1.6;
        }
        .header {
          text-align: center;
          margin-bottom: 40px;
          padding-bottom: 20px;
          border-bottom: 3px solid #0ea5e9;
        }
        .header h1 {
          color: #0ea5e9;
          font-size: 32px;
          margin-bottom: 10px;
        }
        .header .subtitle {
          color: #6b7280;
          font-size: 18px;
        }
        .info-section {
          background: #f3f4f6;
          padding: 20px;
          border-radius: 8px;
          margin-bottom: 30px;
        }
        .info-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 10px;
        }
        .info-label {
          font-weight: 600;
          color: #4b5563;
        }
        .metrics-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 20px;
          margin-bottom: 30px;
        }
        .metric-card {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 25px;
          border-radius: 12px;
          box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }
        .metric-card.green {
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
        }
        .metric-card.blue {
          background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
        }
        .metric-card.yellow {
          background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
        }
        .metric-label {
          font-size: 14px;
          opacity: 0.9;
          margin-bottom: 8px;
        }
        .metric-value {
          font-size: 36px;
          font-weight: bold;
        }
        .section {
          margin-bottom: 30px;
          page-break-inside: avoid;
        }
        .section-title {
          font-size: 24px;
          color: #0ea5e9;
          margin-bottom: 15px;
          padding-bottom: 10px;
          border-bottom: 2px solid #e5e7eb;
        }
        .stats-table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 20px;
        }
        .stats-table td {
          padding: 12px;
          border-bottom: 1px solid #e5e7eb;
        }
        .stats-table td:first-child {
          font-weight: 600;
          color: #4b5563;
          width: 40%;
        }
        .recommendations {
          background: #eff6ff;
          padding: 20px;
          border-radius: 8px;
          border-left: 4px solid #3b82f6;
        }
        .recommendation-item {
          display: flex;
          margin-bottom: 15px;
          align-items: start;
        }
        .recommendation-number {
          background: #3b82f6;
          color: white;
          width: 28px;
          height: 28px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          margin-right: 12px;
          flex-shrink: 0;
        }
        .filler-words-list {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 10px;
        }
        .filler-word-item {
          background: #fef2f2;
          padding: 10px;
          border-radius: 6px;
          border-left: 3px solid #ef4444;
        }
        .filler-word-text {
          font-weight: 600;
          color: #dc2626;
        }
        .filler-word-count {
          color: #6b7280;
          font-size: 14px;
        }
        .footer {
          margin-top: 50px;
          padding-top: 20px;
          border-top: 2px solid #e5e7eb;
          text-align: center;
          color: #6b7280;
          font-size: 14px;
        }
        @media print {
          body { padding: 20px; }
          .metric-card { page-break-inside: avoid; }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>📊 Interview Analysis Report</h1>
        <div class="subtitle">${interview.title}</div>
      </div>

      <div class="info-section">
        <div class="info-row">
          <span class="info-label">Date:</span>
          <span>${formatDate(interview.created_at)}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Duration:</span>
          <span>${interview.duration_seconds ? formatDuration(interview.duration_seconds) : 'N/A'}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Status:</span>
          <span>${interview.status}</span>
        </div>
      </div>

      <div class="metrics-grid">
        <div class="metric-card ${getScoreClass(analysis.confidence_score)}">
          <div class="metric-label">Confidence Score</div>
          <div class="metric-value">${Math.round(analysis.confidence_score)}/100</div>
        </div>
        <div class="metric-card blue">
          <div class="metric-label">Speaking Pace</div>
          <div class="metric-value">${Math.round(analysis.speaking_pace_wpm)} WPM</div>
        </div>
        <div class="metric-card ${getScoreClass(100 - analysis.nervousness_score)}">
          <div class="metric-label">Calmness Score</div>
          <div class="metric-value">${Math.round(100 - analysis.nervousness_score)}/100</div>
        </div>
        <div class="metric-card ${getScoreClass(analysis.emotional_engagement_score)}">
          <div class="metric-label">Engagement Score</div>
          <div class="metric-value">${Math.round(analysis.emotional_engagement_score)}/100</div>
        </div>
      </div>

      <div class="section">
        <h2 class="section-title">📈 Speech Statistics</h2>
        <table class="stats-table">
          <tr>
            <td>Total Words</td>
            <td>${analysis.total_words}</td>
          </tr>
          <tr>
            <td>Unique Words</td>
            <td>${analysis.unique_words}</td>
          </tr>
          <tr>
            <td>Vocabulary Richness</td>
            <td>${((analysis.unique_words / analysis.total_words) * 100).toFixed(1)}%</td>
          </tr>
          <tr>
            <td>Filler Words Count</td>
            <td>${analysis.filler_word_count} (${analysis.filler_word_percentage.toFixed(1)}%)</td>
          </tr>
          <tr>
            <td>Average Pause Duration</td>
            <td>${analysis.average_pause_duration_ms ? (analysis.average_pause_duration_ms / 1000).toFixed(1) + 's' : 'N/A'}</td>
          </tr>
          <tr>
            <td>Longest Pause</td>
            <td>${analysis.longest_pause_duration_ms ? (analysis.longest_pause_duration_ms / 1000).toFixed(1) + 's' : 'N/A'}</td>
          </tr>
        </table>
      </div>

      ${analysis.analysis_data?.filler_word_breakdown && Object.keys(analysis.analysis_data.filler_word_breakdown).length > 0 ? `
      <div class="section">
        <h2 class="section-title">🗣️ Filler Words Breakdown</h2>
        <div class="filler-words-list">
          ${Object.entries(analysis.analysis_data.filler_word_breakdown)
            .sort(([, a], [, b]) => (b as number) - (a as number))
            .slice(0, 9)
            .map(([word, count]) => `
              <div class="filler-word-item">
                <div class="filler-word-text">"${word}"</div>
                <div class="filler-word-count">${count} times</div>
              </div>
            `).join('')}
        </div>
      </div>
      ` : ''}

      <div class="section">
        <h2 class="section-title">💡 Recommendations</h2>
        <div class="recommendations">
          ${generateRecommendations(analysis).map((rec, i) => `
            <div class="recommendation-item">
              <div class="recommendation-number">${i + 1}</div>
              <div>${rec}</div>
            </div>
          `).join('')}
        </div>
      </div>

      <div class="section">
        <h2 class="section-title">📝 Overall Assessment</h2>
        <p style="line-height: 1.8;">${generateOverallAssessment(analysis)}</p>
      </div>

      <div class="footer">
        <p>Generated by AI Interview Emotion Analyzer</p>
        <p>© ${new Date().getFullYear()} - Confidential Interview Analysis</p>
      </div>

      <script>
        window.onload = function() {
          setTimeout(function() {
            window.print();
          }, 500);
        }
      </script>
    </body>
    </html>
  `

  printWindow.document.write(html)
  printWindow.document.close()
}

function getScoreClass(score: number): string {
  if (score >= 80) return 'green'
  if (score >= 60) return 'blue'
  return 'yellow'
}

function generateRecommendations(analysis: InterviewAnalysis): string[] {
  const recommendations: string[] = []

  if (analysis.confidence_score < 60) {
    recommendations.push('Practice more to build confidence. Record yourself regularly and review your performance.')
  }

  if (analysis.filler_word_percentage > 5) {
    recommendations.push('Reduce filler words by pausing instead of saying "um" or "like". Practice mindful speaking.')
  }

  if (analysis.speaking_pace_wpm < 100) {
    recommendations.push('Try to speak a bit faster. Aim for 120-150 words per minute for optimal clarity.')
  } else if (analysis.speaking_pace_wpm > 180) {
    recommendations.push('Slow down your speaking pace. Take deliberate pauses for better clarity and impact.')
  }

  if (analysis.nervousness_score > 60) {
    recommendations.push('Practice relaxation techniques before interviews. Deep breathing and visualization can help.')
  }

  if (analysis.emotional_engagement_score < 60) {
    recommendations.push('Show more enthusiasm and energy in your responses. Use varied tone and expressive language.')
  }

  if (analysis.unique_words / analysis.total_words < 0.4) {
    recommendations.push('Expand your vocabulary. Use more varied and descriptive words in your responses.')
  }

  if (recommendations.length === 0) {
    recommendations.push('Excellent performance! Keep practicing to maintain your strong communication skills.')
    recommendations.push('Consider recording yourself regularly to track continued improvement.')
  }

  return recommendations
}

function generateOverallAssessment(analysis: InterviewAnalysis): string {
  const avgScore =
    (analysis.confidence_score +
      (100 - analysis.nervousness_score) +
      analysis.emotional_engagement_score) / 3

  if (avgScore >= 80) {
    return 'Outstanding performance! You demonstrated excellent communication skills with high confidence and engagement. Your speaking pace was natural, and you used minimal filler words. You maintained composure throughout and showed strong vocabulary usage. Continue practicing to maintain these exceptional skills and consider mentoring others.'
  } else if (avgScore >= 60) {
    return 'Good performance overall. You showed solid communication skills with room for improvement in some areas. Your confidence level is developing well, and you maintained reasonable control over your speech patterns. Focus on the specific recommendations above to enhance your interview performance further. With consistent practice, you can reach the excellent range.'
  } else {
    return 'Your interview shows potential with several areas for improvement. Regular practice and focusing on the recommendations will help you build stronger communication skills. Consider recording yourself more often to track progress, and don\'t be discouraged - improvement comes with consistent effort. Focus on one area at a time, starting with reducing filler words and building confidence.'
  }
}
