# Set the output file
set terminal pngcairo enhanced font 'Verdana,10'
set output 'plot.png'

# Set the title and labels
set title "Sample Data Plot at 50KHz" font ",14"
set xlabel "Time (s)" font ",12"
set ylabel "Amplitude" font ",12"

# Set the grid and style
set grid
set style line 1 linecolor rgb '#0060ad' linetype 1 linewidth 2 pointtype 7 pointsize 1.5
set style line 2 linecolor rgb '#dd181f' linetype 1 linewidth 2

# Calculate the time for each sample
set xdata time
set timefmt "%s"
set format x "%g"
set xrange [0:5.0/50000]

# Plot the data
plot 'data.csv' using ($0/50000):1 with linespoints linestyle 1 title 'Amplitude'
