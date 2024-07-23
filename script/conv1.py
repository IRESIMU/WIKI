# Read the single-line formatted data
input_filename = 'data.txt'
output_filename = 'data.csv'

# Read data from the input file
with open(input_filename, 'r') as infile:
    data = infile.read()

# Split the data into individual values
values = data.strip('[]').split(', ')

# Write each value on a new line in the output file
with open(output_filename, 'w') as outfile:
    for value in values:
        outfile.write(f"{value}\n")

print(f"Data has been formatted and saved to {output_filename}")

#python3 data.py; gnuplot gnu.plot
#gwenview plot.png &
