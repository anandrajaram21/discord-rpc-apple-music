-- get the raw bytes of the artwork into a var
tell application "Music" to tell artwork 1 of current track
	set srcBytes to raw data
	set ext to ".jpg"
end tell

do shell script "mkdir -p $HOME/Documents/MusicRpcPhotos/SavedAlbumArt"

-- get the filename to ~/Desktop/cover.ext
set fileName to ((((path to desktop)) as text) & artistname & songname & ext)
-- write to file
set outFile to open for access file fileName with write permission
-- truncate the file
set eof outFile to 0
-- write the image bytes to the file
write srcBytes to outFile
close access outFile
do shell script "mv -f $HOME/Desktop/" & artistname & songname &".jpg $HOME/Documents/MusicRpcPhotos/SavedAlbumArt"