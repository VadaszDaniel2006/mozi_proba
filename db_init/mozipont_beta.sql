-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Gép: 127.0.0.1
-- Létrehozás ideje: 2026. Jan 30. 13:41
-- Kiszolgáló verziója: 10.4.32-MariaDB
-- PHP verzió: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Adatbázis: `mozipont_beta`
--

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `custom_lists`
--

CREATE TABLE `custom_lists` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `title` varchar(100) NOT NULL,
  `is_public` tinyint(1) DEFAULT 0,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- A tábla adatainak kiíratása `custom_lists`
--

INSERT INTO `custom_lists` (`id`, `user_id`, `title`, `is_public`, `created_at`) VALUES
(1, 11, 'Saját listám', 0, '2026-01-28 22:02:55'),
(2, 12, 'Saját listám', 0, '2026-01-28 22:07:07'),
(3, 13, 'Saját listám', 0, '2026-01-30 11:53:49'),
(4, 14, 'Saját listám', 0, '2026-01-30 12:00:35'),
(5, 15, 'Saját listám', 0, '2026-01-30 13:05:26'),
(6, 16, 'Saját listám', 0, '2026-01-30 13:35:20');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `custom_list_items`
--

CREATE TABLE `custom_list_items` (
  `id` int(11) NOT NULL,
  `list_id` int(11) NOT NULL,
  `film_id` int(11) DEFAULT NULL,
  `sorozat_id` int(11) DEFAULT NULL,
  `added_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- A tábla adatainak kiíratása `custom_list_items`
--

INSERT INTO `custom_list_items` (`id`, `list_id`, `film_id`, `sorozat_id`, `added_at`) VALUES
(7, 5, 10, NULL, '2026-01-30 13:06:42');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `filmek`
--

CREATE TABLE `filmek` (
  `id` int(11) NOT NULL,
  `cim` varchar(255) NOT NULL,
  `leiras` text DEFAULT NULL,
  `poszter_url` varchar(255) DEFAULT NULL,
  `elozetes_url` varchar(255) DEFAULT NULL,
  `megjelenes_ev` int(4) DEFAULT NULL,
  `hossz_perc` int(4) DEFAULT NULL,
  `rating` decimal(3,1) DEFAULT 0.0,
  `rendezo_id` int(11) DEFAULT NULL,
  `kategoria_id` varchar(50) DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- A tábla adatainak kiíratása `filmek`
--

INSERT INTO `filmek` (`id`, `cim`, `leiras`, `poszter_url`, `elozetes_url`, `megjelenes_ev`, `hossz_perc`, `rating`, `rendezo_id`, `kategoria_id`, `created_at`) VALUES
(1, 'Dune: Part Two', 'Paul Atreides egyesíti erőit Chani-val és a fremenekkel, miközben bosszút áll azokon, akik elpusztították a családját.', 'https://image.tmdb.org/t/p/original/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg', 'Way9Dexny3w', 2024, 166, 8.8, 1, 'action', '2026-01-28 18:01:57'),
(2, 'Oppenheimer', 'J. Robert Oppenheimer fizikus története, aki a Manhattan Terv keretében az atombomba kifejlesztésén dolgozott.', 'https://image.tmdb.org/t/p/original/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg', 'uYPbbksJxIg', 2023, 180, 8.6, 2, 'biography', '2026-01-28 18:01:57'),
(3, 'Top Gun: Maverick', 'Harminc év szolgálat után Pete \'Maverick\' Mitchell visszatér, hogy kiképezzen egy különleges egységet.', 'https://image.tmdb.org/t/p/original/62HCnUTziyWcpDaBO2i1DX17ljH.jpg', 'giXco2jaZ_4', 2022, 130, 8.3, 3, 'action', '2026-01-28 18:01:57'),
(4, 'The Batman', 'Amikor Rébusz, a szadista sorozatgyilkos elkezd politikai figurákat gyilkolni, Batman kénytelen a Gotham alvilágában nyomozni.', 'https://image.tmdb.org/t/p/original/74xTEgt7R36Fpooo50r9T25onhq.jpg', 'mqqft2x_Aa4', 2022, 176, 7.8, 4, 'action', '2026-01-28 18:01:57'),
(5, 'Inception', 'Egy tolvaj, aki álommegosztó technológián keresztül lop titkokat, megkapja a feladatot, hogy ültessen el egy ötletet egy vezérigazgató elméjébe.', 'https://image.tmdb.org/t/p/original/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg', 'YoHD9XEInc0', 2010, 148, 8.8, 2, 'scifi', '2026-01-28 18:01:57'),
(6, 'Interstellar', 'Egy csapat felfedező féreglyukon keresztül utazik az űrben, hogy biztosítsák az emberiség túlélését.', 'https://resizing.flixster.com/-XZAfHZM39UwaGJIFWKAE8fS0ak=/v3/t/assets/p10543523_p_v8_as.jpg', 'zSWdZVtXT7E', 2014, 169, 8.7, 2, 'scifi', '2026-01-28 18:01:57'),
(7, 'Avatar: The Way of Water', 'Jake Sully és Neytiri mindent megtesznek, hogy együtt tartsák családjukat, amikor új fenyegetés üti fel a fejét.', 'https://m.media-amazon.com/images/M/MV5BNWI0Y2NkOWEtMmM2OC00MjQ3LWI1YzItZGQxYzQ3NzI4NWZmXkEyXkFqcGc@._V1_.jpg', 'd9MyW72ELq0', 2022, 192, 7.6, 5, 'scifi', '2026-01-28 18:01:57'),
(8, 'Spider-Man: No Way Home', 'Pókember kiléte lelepleződik, ezért Doctor Strange segítségét kéri, de a varázslat balul sül el.', 'https://image.tmdb.org/t/p/original/1g0dhYtq4irTY1GPXvft6k4YLjm.jpg', 'JfVOs4VSpmA', 2021, 148, 8.2, 6, 'action', '2026-01-28 18:01:57'),
(9, 'Deadpool & Wolverine', 'A fásult Wade Wilson kénytelen újra jelmezt húzni, amikor egy új fenyegetés nemcsak a világát, hanem az egész univerzumot veszélyezteti.', 'https://image.tmdb.org/t/p/original/8cdWjvZQUExUUTzyp4t6EDMubfO.jpg', '73_1biulkYk', 2024, 128, 7.9, 7, 'action', '2026-01-28 18:01:57'),
(10, 'Gladiator II', 'Évekkel Maximus halála után Lucius kénytelen belépni a Colosseumba, miután otthonát elfoglalják a zsarnok császárok.', 'https://m.media-amazon.com/images/M/MV5BNmJlZGIzMjEtZWE0NS00NTAxLWIyNGItNjYzYzhjMmI3ZWVmXkEyXkFqcGc@._V1_.jpg', 'IIerkFJEcuU', 2024, 148, 7.5, 8, 'action', '2026-01-28 18:01:57'),
(11, 'Black Panther: Wakanda Forever', 'Wakanda vezetői küzdenek nemzetük védelméért a beavatkozó világhatalmakkal szemben T\'Challa király halála után.', 'https://image.tmdb.org/t/p/original/sv1xJUazXeYqALzczSZ3O6nkH75.jpg', '_Z3QKkl1WyM', 2022, 161, 7.3, 9, 'action', '2026-01-28 18:01:57'),
(12, 'Avengers: Endgame', 'A Bosszúállók megmaradt tagjainak újra össze kell állniuk, hogy visszafordítsák Thanos tetteit és helyreállítsák az univerzum egyensúlyát.', 'https://image.tmdb.org/t/p/original/or06FN3Dka5tukK1e9sl16pB3iy.jpg', 'TcMBFSGVi1c', 2019, 181, 8.4, 10, 'action', '2026-01-28 18:01:57');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `film_gyarto_orszagok`
--

CREATE TABLE `film_gyarto_orszagok` (
  `id` int(11) NOT NULL,
  `film_id` int(11) NOT NULL,
  `nemzetiseg_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- A tábla adatainak kiíratása `film_gyarto_orszagok`
--

INSERT INTO `film_gyarto_orszagok` (`id`, `film_id`, `nemzetiseg_id`) VALUES
(1, 1, 1),
(2, 1, 3),
(3, 2, 1),
(4, 2, 2),
(5, 3, 1),
(6, 4, 1),
(7, 5, 1),
(8, 5, 2),
(9, 6, 1),
(10, 6, 2),
(11, 7, 1),
(12, 8, 1),
(13, 9, 1),
(14, 10, 1),
(15, 10, 2),
(16, 11, 1),
(17, 12, 1);

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `kategoriak`
--

CREATE TABLE `kategoriak` (
  `id` varchar(50) NOT NULL,
  `nev` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- A tábla adatainak kiíratása `kategoriak`
--

INSERT INTO `kategoriak` (`id`, `nev`) VALUES
('action', 'Akció'),
('adventure', 'Kaland'),
('animation', 'Animáció'),
('biography', 'Életrajzi'),
('comedy', 'Vígjáték'),
('crime', 'Bűnügyi'),
('drama', 'Dráma'),
('fantasy', 'Fantasy'),
('horror', 'Horror'),
('scifi', 'Sci-Fi'),
('thriller', 'Thriller');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `kedvencek`
--

CREATE TABLE `kedvencek` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `film_id` int(11) DEFAULT NULL,
  `sorozat_id` int(11) DEFAULT NULL,
  `added_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- A tábla adatainak kiíratása `kedvencek`
--

INSERT INTO `kedvencek` (`id`, `user_id`, `film_id`, `sorozat_id`, `added_at`) VALUES
(1, 1, 10, NULL, '2026-01-28 21:32:59'),
(2, 1, 3, NULL, '2026-01-28 21:34:30'),
(3, 12, 9, NULL, '2026-01-28 22:09:44'),
(4, 11, 2, NULL, '2026-01-30 10:07:30'),
(13, 15, 10, NULL, '2026-01-30 13:06:40');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `media_platformok`
--

CREATE TABLE `media_platformok` (
  `id` int(11) NOT NULL,
  `platform_id` int(11) NOT NULL,
  `film_id` int(11) DEFAULT NULL,
  `sorozat_id` int(11) DEFAULT NULL,
  `kozvetlen_link` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- A tábla adatainak kiíratása `media_platformok`
--

INSERT INTO `media_platformok` (`id`, `platform_id`, `film_id`, `sorozat_id`, `kozvetlen_link`) VALUES
(1, 2, 1, NULL, NULL),
(2, 4, 1, NULL, NULL),
(3, 1, 2, NULL, NULL),
(4, 5, 2, NULL, NULL),
(5, 1, 3, NULL, NULL),
(6, 2, 3, NULL, NULL),
(7, 2, 4, NULL, NULL),
(8, 1, 5, NULL, NULL),
(9, 2, 5, NULL, NULL),
(10, 1, 6, NULL, NULL),
(11, 2, 6, NULL, NULL),
(12, 3, 7, NULL, NULL),
(13, 1, 8, NULL, NULL),
(14, 3, 9, NULL, NULL),
(15, 2, 10, NULL, NULL),
(16, 3, 11, NULL, NULL),
(17, 3, 12, NULL, NULL),
(18, 1, NULL, 101, NULL),
(19, 1, NULL, 102, NULL),
(20, 3, NULL, 103, NULL),
(21, 2, NULL, 104, NULL),
(22, 1, NULL, 105, NULL),
(23, 2, NULL, 106, NULL),
(24, 1, NULL, 107, NULL),
(25, 4, NULL, 108, NULL),
(26, 2, NULL, 109, NULL),
(27, 1, NULL, 110, NULL),
(28, 3, NULL, 111, NULL),
(29, 5, NULL, 112, NULL);

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `nemzetisegek`
--

CREATE TABLE `nemzetisegek` (
  `id` int(11) NOT NULL,
  `nev` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- A tábla adatainak kiíratása `nemzetisegek`
--

INSERT INTO `nemzetisegek` (`id`, `nev`) VALUES
(1, 'Amerikai'),
(2, 'Brit'),
(3, 'Kanadai'),
(4, 'Új-Zéland'),
(5, 'Francia');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `platformok`
--

CREATE TABLE `platformok` (
  `id` int(11) NOT NULL,
  `nev` varchar(100) NOT NULL,
  `logo_url` varchar(255) DEFAULT NULL,
  `weboldal_url` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- A tábla adatainak kiíratása `platformok`
--

INSERT INTO `platformok` (`id`, `nev`, `logo_url`, `weboldal_url`) VALUES
(1, 'Netflix', 'https://upload.wikimedia.org/wikipedia/commons/7/75/Netflix_icon.svg', 'https://www.netflix.com'),
(2, 'HBO Max', 'https://upload.wikimedia.org/wikipedia/commons/c/ce/Max_logo.svg', 'https://www.max.com'),
(3, 'Disney+', 'https://upload.wikimedia.org/wikipedia/commons/3/3e/Disney%2B_logo.svg', 'https://www.disneyplus.com'),
(4, 'Prime Video', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTavYKJKv7ZQVJiZPE8C9jgxN64JpmecOFyFw&s', 'https://www.primevideo.com'),
(5, 'Apple TV+', 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/28/Apple_TV_Plus_Logo.svg/800px-Apple_TV_Plus_Logo.svg.png', 'https://tv.apple.com');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `rendezok`
--

CREATE TABLE `rendezok` (
  `id` int(11) NOT NULL,
  `nev` varchar(150) NOT NULL,
  `nemzetiseg` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- A tábla adatainak kiíratása `rendezok`
--

INSERT INTO `rendezok` (`id`, `nev`, `nemzetiseg`) VALUES
(1, 'Denis Villeneuve', 'Kanadai'),
(2, 'Christopher Nolan', 'Brit-Amerikai'),
(3, 'Joseph Kosinski', 'Amerikai'),
(4, 'Matt Reeves', 'Amerikai'),
(5, 'James Cameron', 'Kanadai'),
(6, 'Jon Watts', 'Amerikai'),
(7, 'Shawn Levy', 'Kanadai'),
(8, 'Ridley Scott', 'Brit'),
(9, 'Ryan Coogler', 'Amerikai'),
(10, 'Anthony Russo, Joe Russo', 'Amerikai'),
(11, 'Duffer Brothers', 'Amerikai'),
(12, 'Vince Gilligan', 'Amerikai'),
(13, 'Jon Favreau', 'Amerikai'),
(14, 'Neil Druckmann', 'Izraeli-Amerikai'),
(15, 'Tim Burton', 'Amerikai'),
(16, 'Ryan Condal', 'Amerikai'),
(17, 'Christian Linke', 'Német'),
(18, 'Eric Kripke', 'Amerikai'),
(19, 'David Benioff', 'Amerikai'),
(20, 'Lauren Schmidt', 'Amerikai'),
(21, 'Michael Waldron', 'Amerikai'),
(22, 'Ben Stiller', 'Amerikai');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `reviews`
--

CREATE TABLE `reviews` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `film_id` int(11) DEFAULT NULL,
  `sorozat_id` int(11) DEFAULT NULL,
  `rating` int(1) NOT NULL,
  `comment` text DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `search_history`
--

CREATE TABLE `search_history` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `search_term` varchar(255) NOT NULL,
  `searched_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `sorozatok`
--

CREATE TABLE `sorozatok` (
  `id` int(11) NOT NULL,
  `cim` varchar(255) NOT NULL,
  `leiras` text DEFAULT NULL,
  `poszter_url` varchar(255) DEFAULT NULL,
  `elozetes_url` varchar(255) DEFAULT NULL,
  `megjelenes_ev_start` int(4) DEFAULT NULL,
  `megjelenes_ev_end` varchar(10) DEFAULT NULL,
  `evadok_szama` int(3) DEFAULT 1,
  `hossz_perc` int(4) DEFAULT NULL,
  `rating` decimal(3,1) DEFAULT 0.0,
  `rendezo_id` int(11) DEFAULT NULL,
  `kategoria_id` varchar(50) DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- A tábla adatainak kiíratása `sorozatok`
--

INSERT INTO `sorozatok` (`id`, `cim`, `leiras`, `poszter_url`, `elozetes_url`, `megjelenes_ev_start`, `megjelenes_ev_end`, `evadok_szama`, `hossz_perc`, `rating`, `rendezo_id`, `kategoria_id`, `created_at`) VALUES
(101, 'Stranger Things', 'Amikor egy kisfiú eltűnik, egy kisvárosnak szembe kell néznie titkos kísérletekkel és természetfeletti erőkkel.', 'https://dnm.nflximg.net/api/v6/2DuQlx0fM4wd1nzqm5BFBi6ILa8/AAAAQeHSBosv8l2X9RZuaT3ygZYs0XLLqa8vrpyBf1dTH8cjYR6sQsL26uyTNujyLkzvZKz3OyFvkd0u6PS-ZGcpyuRHnDLuYXucxhVMJxQXmZLlz88mnJ_jX5UymYsghaBfcEGD2RbIifQR7j4N5gGkvBDQ.jpg?r=473', 'AfQ13jsLDms', 2016, '2026', 4, 50, 8.7, 11, 'horror', '2026-01-28 18:01:57'),
(102, 'Breaking Bad', 'Egy rákdiagnózissal szembesülő kémiatanár metamfetamin gyártásba kezd, hogy biztosítsa családja jövőjét.', 'https://image.tmdb.org/t/p/original/ggFHVNu6YYI5L9pCfOacjizRGt.jpg', 'HhesaQXLuRY', 2008, '2013', 5, 49, 9.5, 12, 'crime', '2026-01-28 18:01:57'),
(103, 'The Mandalorian', 'Egy magányos fejvadász kalandjai a galaxis külső peremén, távol az Új Köztársaság hatáskörétől.', 'https://image.tmdb.org/t/p/original/eU1i6eHXlzMOlEq0ku1Rzq7Y4wA.jpg', 'aOC8E8z_ifw', 2019, '', 3, 40, 8.7, 13, 'scifi', '2026-01-28 18:01:57'),
(104, 'The Last of Us', 'Egy edzett túlélőnek ki kell csempésznie egy 14 éves lányt egy elnyomó karanténzónából.', 'https://image.tmdb.org/t/p/original/uKvVjHNqB5VmOrdxqAt2F7J78ED.jpg', 'uLtkt8BonwM', 2023, '', 1, 50, 8.8, 14, 'drama', '2026-01-28 18:01:57'),
(105, 'Wednesday', 'Wednesday Addams a Nevermore Akadémián töltött évei alatt próbálja uralni képességeit és megoldani egy rejtélyt.', 'https://image.tmdb.org/t/p/original/9PFonBhy4cQy7Jz20NpMygczOkv.jpg', '03u4xyj0TH4', 2022, '', 1, 45, 8.1, 15, 'comedy', '2026-01-28 18:01:57'),
(106, 'House of the Dragon', 'A Targaryen-ház története 200 évvel a Trónok harca eseményei előtt.', 'https://static.posters.cz/image/1300/143695.jpg', 'DotnJ7tTA34', 2022, '', 2, 60, 8.5, 16, 'fantasy', '2026-01-28 18:01:57'),
(107, 'Arcane', 'A testvérek, Vi és Powder a gazdag Piltover és a földalatti Zaun közötti konfliktus ellentétes oldalára kerülnek.', 'https://image.tmdb.org/t/p/original/fqldf2t8ztc9aiwn3k6mlX3tvRT.jpg', 'fXmAurh012s', 2021, '', 1, 40, 9.0, 17, 'animation', '2026-01-28 18:01:57'),
(108, 'The Boys', 'Egy csapat önbíráskodó elindul, hogy leleplezze a szuperhősöket, akik visszaélnek szupererejükkel.', 'https://m.media-amazon.com/images/M/MV5BMGRlZDE2ZGEtZTU5Mi00ODdkLWFmMTEtY2UwMmViNWNmZjczXkEyXkFqcGc@._V1_.jpg', 'Fv0leN8TmR8', 2019, '', 4, 60, 8.7, 18, 'action', '2026-01-28 18:01:57'),
(109, 'Game of Thrones', 'Kilenc nemesi család küzd Westeros földjének uralmáért, miközben egy ősi ellenség tér vissza évezredek óta tartó álmából.', 'https://m.media-amazon.com/images/M/MV5BMTNhMDJmNmYtNDQ5OS00ODdlLWE0ZDAtZTgyYTIwNDY3OTU3XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg', 'KPLWWIOCOOQ', 2011, '2019', 8, 55, 9.2, 19, 'fantasy', '2026-01-28 18:01:57'),
(110, 'The Witcher', 'Ríviai Geralt, a magányos szörnyvadász küzd, hogy megtalálja helyét a világban, ahol az emberek gyakran gonoszabbak, mint a bestiák.', 'https://image.tmdb.org/t/p/original/7vjaCdMw15FEbXyLQTVa04URsPm.jpg', 'ndl1W4ltcmg', 2019, '', 3, 60, 8.0, 20, 'fantasy', '2026-01-28 18:01:57'),
(111, 'Loki', 'A Bosszúállók: Végjáték eseményei után Loki a titokzatos Idővariációs Hatósághoz kerül.', 'https://image.tmdb.org/t/p/original/voHUmluYmKyleFkTu3lOXQG702u.jpg', 'nW948Va-l10', 2021, '2023', 2, 50, 8.2, 21, 'scifi', '2026-01-28 18:01:57'),
(112, 'Severance', 'Mark egy olyan csapatot vezet, akiknek emlékeit sebészeti úton különítették el a munka és a magánélet között.', 'https://static.sorozatjunkie.hu/wp-content/uploads/2025/12/Severance-Kulonvalas-2.-evad-Apple-TV.jpg', 'VwP6M9zS_pQ', 2022, '', 2, 50, 8.7, 22, 'thriller', '2026-01-28 18:01:57');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `sorozat_gyarto_orszagok`
--

CREATE TABLE `sorozat_gyarto_orszagok` (
  `id` int(11) NOT NULL,
  `sorozat_id` int(11) NOT NULL,
  `nemzetiseg_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- A tábla adatainak kiíratása `sorozat_gyarto_orszagok`
--

INSERT INTO `sorozat_gyarto_orszagok` (`id`, `sorozat_id`, `nemzetiseg_id`) VALUES
(1, 101, 1),
(2, 102, 1),
(3, 103, 1),
(4, 104, 1),
(5, 104, 3),
(6, 105, 1),
(7, 106, 1),
(8, 107, 1),
(9, 107, 5),
(10, 108, 1),
(11, 109, 1),
(12, 109, 2),
(13, 110, 1),
(14, 110, 2),
(15, 111, 1),
(16, 112, 1);

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `nev` varchar(100) NOT NULL,
  `username` varchar(50) NOT NULL,
  `email` varchar(150) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `avatar` varchar(255) DEFAULT 'https://upload.wikimedia.org/wikipedia/commons/0/0b/Netflix-avatar.png',
  `role` enum('user','admin') DEFAULT 'user',
  `regisztracio_datum` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- A tábla adatainak kiíratása `users`
--

INSERT INTO `users` (`id`, `nev`, `username`, `email`, `password_hash`, `avatar`, `role`, `regisztracio_datum`) VALUES
(1, 'test', '', 'test@test1.com', '$2a$10$2thZoZ9F4//mLKsdpaZkg.25myRYAcwqDZ5Cs8.mPFeQFkgoL0fLC', 'https://upload.wikimedia.org/wikipedia/commons/0/0b/Netflix-avatar.png', 'user', '2026-01-28 21:32:31'),
(11, 'test3', 'test900', 'test3@gmail.com', '$2a$10$ANQZ2W6.GxpEgID/rKpdTunzLQp4M7C4ivlzHDPq9J1eq/w5XTSYy', 'https://upload.wikimedia.org/wikipedia/commons/0/0b/Netflix-avatar.png', 'user', '2026-01-28 22:02:55'),
(12, 'test4', 'test400', 'test400@test.com', '$2a$10$vUuwVM.EAK/ivlMcaPu5muRvAs/zRkTb9qXiRxlGDRv79YOuKuAi2', 'https://upload.wikimedia.org/wikipedia/commons/0/0b/Netflix-avatar.png', 'user', '2026-01-28 22:07:07'),
(13, 'test5', 'test5', 'test5@test.com', '$2a$10$VAbx27TXWMRwYbAjlTGVJOazPfm5KzWLb/wuGuUuZnLjLGIHF5Nb6', 'https://upload.wikimedia.org/wikipedia/commons/0/0b/Netflix-avatar.png', 'user', '2026-01-30 11:53:49'),
(14, 'test6', 'test6', 'test6@test.com', '$2a$10$zhvWcaw8DWmoBsO4x4kmNOTvEdNZEBtTx2k.s5oThYHIXkm50Ul0G', 'https://upload.wikimedia.org/wikipedia/commons/0/0b/Netflix-avatar.png', 'user', '2026-01-30 12:00:35'),
(15, 'test7', 'test7', 'test7@test.com', '$2a$10$OTgF1nWw267G/D6d0fLLOeXSQop9QimNmKNh57SbPkZMkQrT7819.', 'https://upload.wikimedia.org/wikipedia/commons/0/0b/Netflix-avatar.png', 'user', '2026-01-30 13:05:26'),
(16, 'test8', 'test8', 'test8@test.com', '$2a$10$Lwoq4dD28dtji48wZQwLeeDkBnjSBiSbxUd5Z66NpQLvfRf8eHAGq', 'https://upload.wikimedia.org/wikipedia/commons/0/0b/Netflix-avatar.png', 'user', '2026-01-30 13:35:20');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `user_favorite_categories`
--

CREATE TABLE `user_favorite_categories` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `category_id` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- A tábla adatainak kiíratása `user_favorite_categories`
--

INSERT INTO `user_favorite_categories` (`id`, `user_id`, `category_id`) VALUES
(4, 12, 'action'),
(5, 12, 'scifi'),
(6, 13, 'scifi'),
(7, 13, 'animation'),
(8, 13, 'thriller'),
(9, 15, 'horror'),
(10, 15, 'scifi'),
(11, 15, 'animation'),
(12, 16, 'comedy'),
(13, 16, 'action'),
(14, 16, 'scifi');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `watch_history`
--

CREATE TABLE `watch_history` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `film_id` int(11) DEFAULT NULL,
  `sorozat_id` int(11) DEFAULT NULL,
  `watched_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexek a kiírt táblákhoz
--

--
-- A tábla indexei `custom_lists`
--
ALTER TABLE `custom_lists`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- A tábla indexei `custom_list_items`
--
ALTER TABLE `custom_list_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `list_id` (`list_id`),
  ADD KEY `film_id` (`film_id`),
  ADD KEY `sorozat_id` (`sorozat_id`);

--
-- A tábla indexei `filmek`
--
ALTER TABLE `filmek`
  ADD PRIMARY KEY (`id`),
  ADD KEY `kategoria_id` (`kategoria_id`),
  ADD KEY `rendezo_id` (`rendezo_id`);

--
-- A tábla indexei `film_gyarto_orszagok`
--
ALTER TABLE `film_gyarto_orszagok`
  ADD PRIMARY KEY (`id`),
  ADD KEY `film_id` (`film_id`),
  ADD KEY `nemzetiseg_id` (`nemzetiseg_id`);

--
-- A tábla indexei `kategoriak`
--
ALTER TABLE `kategoriak`
  ADD PRIMARY KEY (`id`);

--
-- A tábla indexei `kedvencek`
--
ALTER TABLE `kedvencek`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `film_id` (`film_id`),
  ADD KEY `sorozat_id` (`sorozat_id`);

--
-- A tábla indexei `media_platformok`
--
ALTER TABLE `media_platformok`
  ADD PRIMARY KEY (`id`),
  ADD KEY `platform_id` (`platform_id`),
  ADD KEY `film_id` (`film_id`),
  ADD KEY `sorozat_id` (`sorozat_id`);

--
-- A tábla indexei `nemzetisegek`
--
ALTER TABLE `nemzetisegek`
  ADD PRIMARY KEY (`id`);

--
-- A tábla indexei `platformok`
--
ALTER TABLE `platformok`
  ADD PRIMARY KEY (`id`);

--
-- A tábla indexei `rendezok`
--
ALTER TABLE `rendezok`
  ADD PRIMARY KEY (`id`);

--
-- A tábla indexei `reviews`
--
ALTER TABLE `reviews`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `film_id` (`film_id`),
  ADD KEY `sorozat_id` (`sorozat_id`);

--
-- A tábla indexei `search_history`
--
ALTER TABLE `search_history`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- A tábla indexei `sorozatok`
--
ALTER TABLE `sorozatok`
  ADD PRIMARY KEY (`id`),
  ADD KEY `kategoria_id` (`kategoria_id`),
  ADD KEY `rendezo_id` (`rendezo_id`);

--
-- A tábla indexei `sorozat_gyarto_orszagok`
--
ALTER TABLE `sorozat_gyarto_orszagok`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sorozat_id` (`sorozat_id`),
  ADD KEY `nemzetiseg_id` (`nemzetiseg_id`);

--
-- A tábla indexei `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`);

--
-- A tábla indexei `user_favorite_categories`
--
ALTER TABLE `user_favorite_categories`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `category_id` (`category_id`);

--
-- A tábla indexei `watch_history`
--
ALTER TABLE `watch_history`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `film_id` (`film_id`),
  ADD KEY `sorozat_id` (`sorozat_id`);

--
-- A kiírt táblák AUTO_INCREMENT értéke
--

--
-- AUTO_INCREMENT a táblához `custom_lists`
--
ALTER TABLE `custom_lists`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT a táblához `custom_list_items`
--
ALTER TABLE `custom_list_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT a táblához `filmek`
--
ALTER TABLE `filmek`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT a táblához `film_gyarto_orszagok`
--
ALTER TABLE `film_gyarto_orszagok`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT a táblához `kedvencek`
--
ALTER TABLE `kedvencek`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT a táblához `media_platformok`
--
ALTER TABLE `media_platformok`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=30;

--
-- AUTO_INCREMENT a táblához `nemzetisegek`
--
ALTER TABLE `nemzetisegek`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT a táblához `platformok`
--
ALTER TABLE `platformok`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT a táblához `rendezok`
--
ALTER TABLE `rendezok`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT a táblához `reviews`
--
ALTER TABLE `reviews`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT a táblához `search_history`
--
ALTER TABLE `search_history`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT a táblához `sorozatok`
--
ALTER TABLE `sorozatok`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=113;

--
-- AUTO_INCREMENT a táblához `sorozat_gyarto_orszagok`
--
ALTER TABLE `sorozat_gyarto_orszagok`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT a táblához `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT a táblához `user_favorite_categories`
--
ALTER TABLE `user_favorite_categories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT a táblához `watch_history`
--
ALTER TABLE `watch_history`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Megkötések a kiírt táblákhoz
--

--
-- Megkötések a táblához `custom_lists`
--
ALTER TABLE `custom_lists`
  ADD CONSTRAINT `custom_lists_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Megkötések a táblához `custom_list_items`
--
ALTER TABLE `custom_list_items`
  ADD CONSTRAINT `custom_list_items_ibfk_1` FOREIGN KEY (`list_id`) REFERENCES `custom_lists` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `custom_list_items_ibfk_2` FOREIGN KEY (`film_id`) REFERENCES `filmek` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `custom_list_items_ibfk_3` FOREIGN KEY (`sorozat_id`) REFERENCES `sorozatok` (`id`) ON DELETE CASCADE;

--
-- Megkötések a táblához `filmek`
--
ALTER TABLE `filmek`
  ADD CONSTRAINT `filmek_ibfk_1` FOREIGN KEY (`kategoria_id`) REFERENCES `kategoriak` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `filmek_ibfk_2` FOREIGN KEY (`rendezo_id`) REFERENCES `rendezok` (`id`) ON DELETE SET NULL;

--
-- Megkötések a táblához `film_gyarto_orszagok`
--
ALTER TABLE `film_gyarto_orszagok`
  ADD CONSTRAINT `film_gyarto_orszagok_ibfk_1` FOREIGN KEY (`film_id`) REFERENCES `filmek` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `film_gyarto_orszagok_ibfk_2` FOREIGN KEY (`nemzetiseg_id`) REFERENCES `nemzetisegek` (`id`) ON DELETE CASCADE;

--
-- Megkötések a táblához `kedvencek`
--
ALTER TABLE `kedvencek`
  ADD CONSTRAINT `kedvencek_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `kedvencek_ibfk_2` FOREIGN KEY (`film_id`) REFERENCES `filmek` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `kedvencek_ibfk_3` FOREIGN KEY (`sorozat_id`) REFERENCES `sorozatok` (`id`) ON DELETE CASCADE;

--
-- Megkötések a táblához `media_platformok`
--
ALTER TABLE `media_platformok`
  ADD CONSTRAINT `media_platformok_ibfk_1` FOREIGN KEY (`platform_id`) REFERENCES `platformok` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `media_platformok_ibfk_2` FOREIGN KEY (`film_id`) REFERENCES `filmek` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `media_platformok_ibfk_3` FOREIGN KEY (`sorozat_id`) REFERENCES `sorozatok` (`id`) ON DELETE CASCADE;

--
-- Megkötések a táblához `reviews`
--
ALTER TABLE `reviews`
  ADD CONSTRAINT `reviews_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `reviews_ibfk_2` FOREIGN KEY (`film_id`) REFERENCES `filmek` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `reviews_ibfk_3` FOREIGN KEY (`sorozat_id`) REFERENCES `sorozatok` (`id`) ON DELETE CASCADE;

--
-- Megkötések a táblához `search_history`
--
ALTER TABLE `search_history`
  ADD CONSTRAINT `search_history_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Megkötések a táblához `sorozatok`
--
ALTER TABLE `sorozatok`
  ADD CONSTRAINT `sorozatok_ibfk_1` FOREIGN KEY (`kategoria_id`) REFERENCES `kategoriak` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `sorozatok_ibfk_2` FOREIGN KEY (`rendezo_id`) REFERENCES `rendezok` (`id`) ON DELETE SET NULL;

--
-- Megkötések a táblához `sorozat_gyarto_orszagok`
--
ALTER TABLE `sorozat_gyarto_orszagok`
  ADD CONSTRAINT `sorozat_gyarto_orszagok_ibfk_1` FOREIGN KEY (`sorozat_id`) REFERENCES `sorozatok` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `sorozat_gyarto_orszagok_ibfk_2` FOREIGN KEY (`nemzetiseg_id`) REFERENCES `nemzetisegek` (`id`) ON DELETE CASCADE;

--
-- Megkötések a táblához `user_favorite_categories`
--
ALTER TABLE `user_favorite_categories`
  ADD CONSTRAINT `user_favorite_categories_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `user_favorite_categories_ibfk_2` FOREIGN KEY (`category_id`) REFERENCES `kategoriak` (`id`) ON DELETE CASCADE;

--
-- Megkötések a táblához `watch_history`
--
ALTER TABLE `watch_history`
  ADD CONSTRAINT `watch_history_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `watch_history_ibfk_2` FOREIGN KEY (`film_id`) REFERENCES `filmek` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `watch_history_ibfk_3` FOREIGN KEY (`sorozat_id`) REFERENCES `sorozatok` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
