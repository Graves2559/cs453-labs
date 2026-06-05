export function handleCommand(line) {
    if (line == null) {
        return "ERROR empty command";
    }

    const trimmed = line.trim();

    if (trimmed.length === 0) {
        return "ERROR empty command";
    }

    const [command, ...parts] = trimmed.split(" ");
    const argument = parts.join(" ");

    switch (command.toUpperCase()) {
        case "ECHO":
            return argument;
        
        case "UPPER":
            return argument.toUpperCase();

        case "LOWER":
            return argument.toLowerCase();
        
        case "REVERSE":
            let reversed = "";
            for (let i = argument.length - 1; i >= 0; i--) {
                reversed += argument[i];
            }
            return reversed;

        case "QUIT":
            return "Goodbye.";

        default:
            return `ERROR unknown command: ${command}`;
    }
}

export function shouldCloseConnection(line) {
    return line.trim().toUpperCase() === "QUIT";
}