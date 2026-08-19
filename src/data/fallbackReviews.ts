export type Review = {
  name: string;
  location: string;
  rating: number;
  date: string;
  review: string;
  service: string;
  avatarUrl?: string;
  images?: string[];
  sourceUrl?: string;
};

/**
 * A snapshot of the real Google reviews, shown only when /api/reviews is
 * unreachable. These replaced a set of invented testimonials that named
 * services the business no longer offers (pressure washing, window washing),
 * so a failing API used to show visitors fabricated praise for work we
 * do not do. Refresh by re-running the API and pasting the result here.
 */
export const fallbackReviews: Review[] = [
  {
    "name": "Steve Kelly",
    "location": "",
    "rating": 4,
    "date": "July 2026",
    "review": "Josiah worked very hard to provide excellent power washing team after one of his subs did not respond to his calls/texts leading up to our scheduled appt. He came through and it was the best job we have had in last 10 years.",
    "service": "Google Review",
    "avatarUrl": "https://lh3.googleusercontent.com/a-/ALV-UjXznfdhSqnUNXfUJo7daxvS7y76WLuG-L68KG6sD3qfRiUP5RQ=s1920-c-rp-mo-br100",
    "images": [],
    "sourceUrl": "https://www.google.com/maps/reviews/data=!4m8!14m7!1m6!2m5!1sCi9DQUlRQUNvZENodHljRjlvT25sdFIzTkxjVW90VWt0clptSTBjMll6TVRGalRtYxAB!2m1!1s0x0:0x2cf3ac41dfcc8b72!3m1!1s2@1:CAIQACodChtycF9oOnltR3NLcUotUktrZmI0c2YzMTFjTmc%7C%7C?hl=en"
  },
  {
    "name": "Margaret Little",
    "location": "",
    "rating": 5,
    "date": "July 2026",
    "review": "We had a great experience with Firm Foundation Property Service. Josiah and his team cleared and trimmed several trees across our property and also handled some much-needed lawn maintenance quickly and thoroughly. Josiah was responsive, efficient, and easy to work with from start to finish. We trusted his team to get the job done well, and they absolutely delivered. A worthwhile investment, and we plan to use them again.",
    "service": "Google Review",
    "avatarUrl": "https://lh3.googleusercontent.com/a-/ALV-UjVg4KEGxzVVp9rX1QwKaa3JUA4YYZKwjj4MIBbv3fGHIDhLCYut=s1920-c-rp-mo-br100",
    "images": [],
    "sourceUrl": "https://www.google.com/maps/reviews/data=!4m8!14m7!1m6!2m5!1sCi9DQUlRQUNvZENodHljRjlvT21ZM1JXWjRiM2hNV0VocFJteE1ZMGhhUlc5eWRHYxAB!2m1!1s0x0:0x2cf3ac41dfcc8b72!3m1!1s2@1:CAIQACodChtycF9oOmY3RWZ4b3hMWEhpRmxMY0haRW9ydGc%7C%7C?hl=en"
  },
  {
    "name": "Terry Weeks",
    "location": "",
    "rating": 5,
    "date": "April 2026",
    "review": "Josiah was phenomenal in helping us with property maintenance work on our commercial buildings in Mt. Pleasant. Professional, smart, hard working and he does a great job!  We will definitely use Firm Foundation for our property maintenance needs moving forward.",
    "service": "Google Review",
    "avatarUrl": "https://lh3.googleusercontent.com/a/ACg8ocJLkNi5aIGMM0xXYdO1U35_Q2ytudQAhFbbAmZx_Im3vUAZyQ=s1920-c-rp-mo-br100",
    "images": [],
    "sourceUrl": "https://www.google.com/maps/reviews/data=!4m8!14m7!1m6!2m5!1sCi9DQUlRQUNvZENodHljRjlvT2tWM1FWUnJWMDFRYzFsR1VXTmFjMlUxZVZkaFluYxAB!2m1!1s0x0:0x2cf3ac41dfcc8b72!3m1!1s2@1:CAIQACodChtycF9oOkV3QVRrV01Qc1lGUWNac2U1eVdhYnc%7C%7C?hl=en"
  },
  {
    "name": "Andi Andrew",
    "location": "",
    "rating": 5,
    "date": "April 2026",
    "review": "Firm Foundation truly delivered exactly what I had asked and hoped for. Josiah was efficient, hard working and did a beautiful job with the landscaping projects I needed. I highly recommend Firm Foundation!",
    "service": "Google Review",
    "avatarUrl": "https://lh3.googleusercontent.com/a/ACg8ocJp1RIoyfyOJU6GwG52q5bmf2xu4qhPf_z1uBe2Pc8XFWOR3Q=s1920-c-rp-mo-br100",
    "images": [],
    "sourceUrl": "https://www.google.com/maps/reviews/data=!4m8!14m7!1m6!2m5!1sCi9DQUlRQUNvZENodHljRjlvT2xWaWJ6VllkazlZZVMwMWVITjJhbTR6WkZOVlZXYxAB!2m1!1s0x0:0x2cf3ac41dfcc8b72!3m1!1s2@1:CAIQACodChtycF9oOlVibzVYdk9YeS01eHN2am4zZFNVVWc%7C%7C?hl=en"
  },
  {
    "name": "Tricia Harter",
    "location": "",
    "rating": 5,
    "date": "April 2026",
    "review": "I cannot say enough about the landscaping that Josiah did at our home this week! He is such a kind, respectful, hard-working, young man and I am so unbelievably grateful for the beautiful work that he did. We just moved into our home a couple months ago and it was so overgrown and hard to look at! Because of Josiah,  we are now excited to be outside and enjoy our gorgeous landscape! I recommend him 1000%.",
    "service": "Google Review",
    "avatarUrl": "https://lh3.googleusercontent.com/a-/ALV-UjVLmFNOh8FsIgkvlEiByMCfGm8z0A-RUyBgX7cPiXRlQ1FxyeSdKQ=s1920-c-rp-mo-br100",
    "images": [
      "https://lh3.googleusercontent.com/grass-cs/ACvplmNCiduUcbaVSfX3EuwlTPH7ZbpWuFrCxy0Q8B76rKqD-8R4af0yJaJ4otSWGL4m5TLrZbiWUKhCLy_SvzOXRDiXLfY6KX-oeTt4C7nKXZFykYdkMbfWoIF_NWmwij57skk5PGCya4zbl-iN=k-no",
      "https://lh3.googleusercontent.com/grass-cs/ACvplmOWYcGcN_LQSSWgGTJrN_UqiZdYtMnMTq6Ob7Kc04PKvUvF1Vv8HGWO_fiAHiGhNS4rF_2HQnzvd8pCywWFfkBxY8LvqbfFsSZlTl78PDovBEtlk3YiUhpQdBFxEOR6o8pp5LN37c0F08A=k-no"
    ],
    "sourceUrl": "https://www.google.com/maps/reviews/data=!4m8!14m7!1m6!2m5!1sCi9DQUlRQUNvZENodHljRjlvT25OYVpHeHNUMTg0TkdsQlEwMHpTWGhQYUhoUU9IYxAB!2m1!1s0x0:0x2cf3ac41dfcc8b72!3m1!1s2@1:CAIQACodChtycF9oOnNaZGxsT184NGlBQ00zSXhPaHhQOHc%7C%7C?hl=en"
  }
];
