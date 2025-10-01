"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type AudioPlayerProps = {
	src: string;
	title: string;
};

function formatTime(totalSeconds: number): string {
	if (!isFinite(totalSeconds) || totalSeconds < 0) return "0:00";
	const minutes = Math.floor(totalSeconds / 60);
	const seconds = Math.floor(totalSeconds % 60);
	return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

export default function AudioPlayer({ src, title }: AudioPlayerProps) {
	const audioRef = useRef<HTMLAudioElement | null>(null);
	const [isPlaying, setIsPlaying] = useState(false);
	const [currentTime, setCurrentTime] = useState(0);
	const [duration, setDuration] = useState(0);
	const progressPercent = useMemo(() => (duration > 0 ? (currentTime / duration) * 100 : 0), [currentTime, duration]);

	useEffect(() => {
		const audio = audioRef.current;
		if (!audio) return;

		const onTime = () => setCurrentTime(audio.currentTime || 0);
		const onLoaded = () => setDuration(audio.duration || 0);
		const onEnd = () => setIsPlaying(false);

		audio.addEventListener("timeupdate", onTime);
		audio.addEventListener("loadedmetadata", onLoaded);
		audio.addEventListener("ended", onEnd);

		return () => {
			audio.removeEventListener("timeupdate", onTime);
			audio.removeEventListener("loadedmetadata", onLoaded);
			audio.removeEventListener("ended", onEnd);
		};
	}, []);

	async function togglePlay() {
		const audio = audioRef.current;
		if (!audio) return;
		if (isPlaying) {
			audio.pause();
			setIsPlaying(false);
		} else {
			try {
				await audio.play();
				setIsPlaying(true);
			} catch {
				// ignore
			}
		}
	}

	function onSeek(e: React.ChangeEvent<HTMLInputElement>) {
		const audio = audioRef.current;
		if (!audio) return;
		const next = (Number(e.target.value) / 100) * (duration || 0);
		audio.currentTime = next;
		setCurrentTime(next);
	}

	return (
		<div className="rounded-md border border-foreground/10 p-3 md:p-4">
			<div className="flex items-start justify-between gap-3">
				<div className="w-full min-w-0">
					<div className="font-medium leading-tight truncate" title={title}>{title}</div>
					<div className="mt-2 flex items-center gap-3">
						<button
							onClick={togglePlay}
							className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-foreground/20 hover:bg-foreground/5"
							aria-label={isPlaying ? "Pause" : "Play"}
						>
							{isPlaying ? (
								<span className="block h-3 w-3 border-l-2 border-r-2 border-foreground" />
							) : (
								<span className="ml-[2px] block h-0 w-0 border-y-[6px] border-l-[10px] border-y-transparent border-l-foreground" />
							)}
						</button>
						<div className="flex-1">
							<input
								type="range"
								min={0}
								max={100}
								value={progressPercent}
								onChange={onSeek}
								className="w-full accent-foreground/70"
								aria-label="Seek"
							/>
							<div className="mt-1 flex justify-between text-[0.75rem] text-foreground/60">
								<span>{formatTime(currentTime)}</span>
								<span>{formatTime(duration)}</span>
							</div>
						</div>
					</div>
				</div>
			</div>
			<audio ref={audioRef} preload="none" src={src} />
		</div>
	);
}



