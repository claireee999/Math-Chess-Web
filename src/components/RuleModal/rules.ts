export const rules = {
    strings: [
        "Move: : Any chess piece can be moved one step to an adjacent empty space.",
        "Jump: Any chess piece can jump over an adjacent chess piece, but it cannot perform consecutive jumps.",
        "Single Hop: A chess piece is able to jump over several other chess pieces in the same straight line. The condition is that the numbers of the pieces being jumped over must be obtained through one or more arithmetic operations such as addition, subtraction, multiplication, or division, and the result should be the number of the piece to be hopped over.",
        "Consecutive Hop: A chess piece can continuously hop over segments of chess pieces that can yield the same result. "
    ],
};
