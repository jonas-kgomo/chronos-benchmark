# VHS documentation
#
# Output:
#   Output <path>               # Path to the output file (e.g. demo.gif, demo.mp4, demo.webm)
#
# Settings:
#   Set FontSize <number>       # Set the font size of the terminal
#   Set FontFamily <string>     # Set the font family of the terminal
#   Set Height <number>         # Set the height of the terminal
#   Set Width <number>          # Set the width of the terminal
#   Set Padding <number>        # Set the padding of the terminal
#   Set Theme <json|string>     # Set the theme of the terminal
#   Set WindowBar <string>      # Set the window bar type (Colorful, Rings, Moon, None)
#
# Sleep:
#   Sleep <time>                # Sleep for a set amount of time in seconds
#
# Type:
#   Type[@<time>] "<text>"      # Type text into the terminal
#
# Keys:
#   Backspace[@<time>] [number] # Press the Backspace key
#   Down[@<time>] [number]      # Press the Down key
#   Enter[@<time>] [number]     # Press the Enter key
#   Space[@<time>] [number]     # Press the Space key
#   Tab[@<time>] [number]       # Press the Tab key
#   Left[@<time>] [number]      # Press the Left Arrow key
#   Right[@<time>] [number]     # Press the Right Arrow key
#   Up[@<time>] [number]        # Press the Up Arrow key
#   PageUp[@<time>] [number]    # Press the Page Up key
#   PageDown[@<time>] [number]  # Press the Page Down key
#   Ctrl+<key>                  # Press the Control key + <key> (e.g. Ctrl+C)
#
# Display:
#   Hide                        # Hide the subsequent commands from the output
#   Show                        # Show the subsequent commands from the output

Output demo.gif

Set FontSize 16
Set Width 1200
Set Height 800
Set WindowBar Colorful
Set Theme "Catppuccin Mocha"

Hide
Type "npm run build"
Enter
Sleep 5s
Type "alias chronos='node dist/index.js'"
Enter
Type "clear"
Enter
Show

Type "chronos benchmark --tokens"
Enter
Sleep 8s

Type "chronos benchmark --agents"
Enter
Sleep 15s

Type "chronos resources"
Enter
Sleep 5s

