import activityRoom640Avif from "../assets/generated/responsive/activity-room-640.avif";
import activityRoom960Avif from "../assets/generated/responsive/activity-room-960.avif";
import activityRoom1280Avif from "../assets/generated/responsive/activity-room-1280.avif";
import activityRoom1600Avif from "../assets/generated/responsive/activity-room-1600.avif";
import activityRoom640Webp from "../assets/generated/responsive/activity-room-640.webp";
import activityRoom960Webp from "../assets/generated/responsive/activity-room-960.webp";
import activityRoom1280Webp from "../assets/generated/responsive/activity-room-1280.webp";
import activityRoom1600Webp from "../assets/generated/responsive/activity-room-1600.webp";
import activityTournament640Avif from "../assets/generated/responsive/activity-tournament-640.avif";
import activityTournament960Avif from "../assets/generated/responsive/activity-tournament-960.avif";
import activityTournament1280Avif from "../assets/generated/responsive/activity-tournament-1280.avif";
import activityTournament640Webp from "../assets/generated/responsive/activity-tournament-640.webp";
import activityTournament960Webp from "../assets/generated/responsive/activity-tournament-960.webp";
import activityTournament1280Webp from "../assets/generated/responsive/activity-tournament-1280.webp";
import campusMap640Avif from "../assets/generated/responsive/campus-map-640.avif";
import campusMap960Avif from "../assets/generated/responsive/campus-map-960.avif";
import campusMap1280Avif from "../assets/generated/responsive/campus-map-1280.avif";
import campusMap640Webp from "../assets/generated/responsive/campus-map-640.webp";
import campusMap960Webp from "../assets/generated/responsive/campus-map-960.webp";
import campusMap1280Webp from "../assets/generated/responsive/campus-map-1280.webp";
import emblem72Webp from "../assets/generated/responsive/emblem-72.webp";
import emblem144Webp from "../assets/generated/responsive/emblem-144.webp";
import hero480Avif from "../assets/generated/responsive/hero-480.avif";
import hero768Avif from "../assets/generated/responsive/hero-768.avif";
import hero1024Avif from "../assets/generated/responsive/hero-1024.avif";
import hero1254Avif from "../assets/generated/responsive/hero-1254.avif";
import hero480Webp from "../assets/generated/responsive/hero-480.webp";
import hero768Webp from "../assets/generated/responsive/hero-768.webp";
import hero1024Webp from "../assets/generated/responsive/hero-1024.webp";
import hero1254Webp from "../assets/generated/responsive/hero-1254.webp";
import logo160Webp from "../assets/generated/responsive/logo-160.webp";
import logo280Webp from "../assets/generated/responsive/logo-280.webp";
import logo560Webp from "../assets/generated/responsive/logo-560.webp";

const heroSizes = "(min-width: 1024px) 780px, (min-width: 768px) 690px, calc(100vw - 40px)";
const contentSizes = "(min-width: 768px) 832px, calc(100vw - 40px)";

function createSrcSet(entries) {
  return entries.map(([src, width]) => `${src} ${width}w`).join(", ");
}

export const heroImage = {
  width: 1254,
  height: 1254,
  sizes: heroSizes,
  avifSrcSet: createSrcSet([
    [hero480Avif, 480],
    [hero768Avif, 768],
    [hero1024Avif, 1024],
    [hero1254Avif, 1254],
  ]),
  webpSrcSet: createSrcSet([
    [hero480Webp, 480],
    [hero768Webp, 768],
    [hero1024Webp, 1024],
    [hero1254Webp, 1254],
  ]),
  fallback: hero1254Webp,
};

export const activityRoomImage = {
  width: 1600,
  height: 1200,
  sizes: contentSizes,
  avifSrcSet: createSrcSet([
    [activityRoom640Avif, 640],
    [activityRoom960Avif, 960],
    [activityRoom1280Avif, 1280],
    [activityRoom1600Avif, 1600],
  ]),
  webpSrcSet: createSrcSet([
    [activityRoom640Webp, 640],
    [activityRoom960Webp, 960],
    [activityRoom1280Webp, 1280],
    [activityRoom1600Webp, 1600],
  ]),
  fallback: activityRoom960Webp,
};

export const activityTournamentImage = {
  width: 1350,
  height: 1080,
  sizes: contentSizes,
  avifSrcSet: createSrcSet([
    [activityTournament640Avif, 640],
    [activityTournament960Avif, 960],
    [activityTournament1280Avif, 1280],
  ]),
  webpSrcSet: createSrcSet([
    [activityTournament640Webp, 640],
    [activityTournament960Webp, 960],
    [activityTournament1280Webp, 1280],
  ]),
  fallback: activityTournament960Webp,
};

export const campusMapImage = {
  width: 2017,
  height: 1712,
  sizes: contentSizes,
  avifSrcSet: createSrcSet([
    [campusMap640Avif, 640],
    [campusMap960Avif, 960],
    [campusMap1280Avif, 1280],
  ]),
  webpSrcSet: createSrcSet([
    [campusMap640Webp, 640],
    [campusMap960Webp, 960],
    [campusMap1280Webp, 1280],
  ]),
  fallback: campusMap960Webp,
};

export const emblemImage = {
  width: 72,
  height: 72,
  sizes: "(min-width: 768px) 72px, 48px",
  webpSrcSet: createSrcSet([
    [emblem72Webp, 72],
    [emblem144Webp, 144],
  ]),
  fallback: emblem144Webp,
};

export const logoImage = {
  width: 560,
  height: 99,
  sizes: "(min-width: 768px) 280px, 45vw",
  webpSrcSet: createSrcSet([
    [logo160Webp, 160],
    [logo280Webp, 280],
    [logo560Webp, 560],
  ]),
  fallback: logo560Webp,
};
