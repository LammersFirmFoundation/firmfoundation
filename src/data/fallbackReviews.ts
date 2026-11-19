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
 * do not do. Refresh by re-running the API and pasting the result here (last: 2026-11-19,
 * 16 with text of Google's 17; Will Lammers's review left out as family).
 */
export const fallbackReviews: Review[] = [
  {
    "name": "Nico Scalia",
    "location": "",
    "rating": 5,
    "date": "November 2026",
    "review": "Best of the best!",
    "service": "Google Review",
    "avatarUrl": "https://lh3.googleusercontent.com/a-/ALV-UjV1W3_AD_Bid-Qssn6Rqc8gZtdx7dsi9v7OYTyjCTxQg4vKS8Q=s64-c-rp-mo-br100",
    "images": [],
    "sourceUrl": "https://www.google.com/maps/reviews/data=!4m8!14m7!1m6!2m5!1sCi9DQUlRQUNvZENodHljRjlvT2xaUmFrbGlUR1p4Y25BNGFGUmxPWGxJZDI0NVUwRRAB!2m1!1s0x0:0x2cf3ac41dfcc8b72!3m1!1s2@1:CAIQACodChtycF9oOlZRakliTGZxcnA4aFRlOXlId245U0E%7C%7C?hl=en-US"
  },
  {
    "name": "jcboksa",
    "location": "",
    "rating": 5,
    "date": "November 2026",
    "review": "Best in the business! Great pricing, honest, reliable, and takes great pride in their work. Don’t waste your time calling anyone else!",
    "service": "Google Review",
    "avatarUrl": "https://lh3.googleusercontent.com/a/ACg8ocImHOV6x0C9YLVq6VSA3rmtqKnHm63rd3o3HC3ApHXhiMkSwA=s64-c-rp-mo-br100",
    "images": [],
    "sourceUrl": "https://www.google.com/maps/reviews/data=!4m8!14m7!1m6!2m5!1sCi9DQUlRQUNvZENodHljRjlvT2xKTWNuWmZTVlZIVWtsaU9FNWZhMG8zVm1OcFowRRAB!2m1!1s0x0:0x2cf3ac41dfcc8b72!3m1!1s2@1:CAIQACodChtycF9oOlJMcnZfSVVHUkliOE5fa0o3VmNpZ0E%7C%7C?hl=en-US"
  },
  {
    "name": "Jack Black",
    "location": "",
    "rating": 5,
    "date": "November 2026",
    "review": "Amazing people. Everyone I talked to was great!",
    "service": "Google Review",
    "avatarUrl": "https://lh3.googleusercontent.com/a/ACg8ocJpLf7VvSNt8zf90u_3_WFhuaTAdy9SvZpJc84YTuytBlHQUA=s64-c-rp-mo-br100",
    "images": [],
    "sourceUrl": "https://www.google.com/maps/reviews/data=!4m8!14m7!1m6!2m5!1sCi9DQUlRQUNvZENodHljRjlvT2tRNWNrbGFOMXB4TjFaUlJHZDRiRTltTVRWcFpWRRAB!2m1!1s0x0:0x2cf3ac41dfcc8b72!3m1!1s2@1:CAIQACodChtycF9oOkQ5cklaN1pxN1ZRRGd4bE9mMTVpZVE%7C%7C?hl=en-US"
  },
  {
    "name": "Lee Evans",
    "location": "",
    "rating": 5,
    "date": "November 2026",
    "review": "Highly recommend hiring these guys! Everything went smoothly and just a pleasure to work with.",
    "service": "Google Review",
    "avatarUrl": "https://lh3.googleusercontent.com/a/ACg8ocI6snXgEXq9TLmb7EUXHUxVJK_q11ZRQLwo76waeG2xvXTWlA=s64-c-rp-mo-br100",
    "images": [],
    "sourceUrl": "https://www.google.com/maps/reviews/data=!4m8!14m7!1m6!2m5!1sCi9DQUlRQUNvZENodHljRjlvT21WTFZUZEdWbkZHV2xKSWNqUlNUaTFJU213eFFXYxAB!2m1!1s0x0:0x2cf3ac41dfcc8b72!3m1!1s2@1:CAIQACodChtycF9oOmVLVTdGVnFGWlJIcjRSTi1ISmwxQWc%7C%7C?hl=en-US"
  },
  {
    "name": "Pierce Frederick",
    "location": "",
    "rating": 5,
    "date": "November 2026",
    "review": "Absolutely fantastic work, would highly recommend!",
    "service": "Google Review",
    "avatarUrl": "https://lh3.googleusercontent.com/a-/ALV-UjWaVRbNBcLqmXi08cuBCP-jEGZuVx-HTkc-4jp4oQGyIGgiVdzY=s64-c-rp-mo-ba12-br100",
    "images": [],
    "sourceUrl": "https://www.google.com/maps/reviews/data=!4m8!14m7!1m6!2m5!1sCi9DQUlRQUNvZENodHljRjlvT25sMlFtOWtNVll0VVVaYWVHVkVZbkpVWVZsUlVHYxAB!2m1!1s0x0:0x2cf3ac41dfcc8b72!3m1!1s2@1:CAIQACodChtycF9oOnl2Qm9kMVYtUUZaeGVEYnJUYVlRUGc%7C%7C?hl=en-US"
  },
  {
    "name": "Benjamin Thompson",
    "location": "",
    "rating": 5,
    "date": "November 2026",
    "review": "Josiah and his team are incredibly hard workers who is detail focused. Firm Foundation does everything with excellence and prioritize customer satisfaction!",
    "service": "Google Review",
    "avatarUrl": "https://lh3.googleusercontent.com/a-/ALV-UjWRBHpdoKs1z_vGSz6qYqgR3SsmjhEpWsHe9vCBBPRbJRuf4XVs=s64-c-rp-mo-br100",
    "images": [],
    "sourceUrl": "https://www.google.com/maps/reviews/data=!4m8!14m7!1m6!2m5!1sCi9DQUlRQUNvZENodHljRjlvT20weFRYUm1UVVJwVFhobFRWVm5hVVpHYmxjMFNrRRAB!2m1!1s0x0:0x2cf3ac41dfcc8b72!3m1!1s2@1:CAIQACodChtycF9oOm0xTXRmTURpTXhlTVVnaUZGblc0SkE%7C%7C?hl=en-US"
  },
  {
    "name": "Jessica Warden",
    "location": "",
    "rating": 5,
    "date": "October 2026",
    "review": "We couldn’t be happier with the work Firm Foundation did on my kitchen! They removed the old tile, replaced the drywall, installed the new tile, and finished everything off with the cabinet hardware. The kitchen looks great, and I’m so pleased with how everything turned out. I highly recommend Firm Foundation to anyone looking for quality work and a great experience. We would absolutely use them again!",
    "service": "Google Review",
    "avatarUrl": "https://lh3.googleusercontent.com/a/ACg8ocKsR8MIPHlTv-QIXULQ4dQe3sx9u0GaTiCjILyjdDLwcycNSA=s64-c-rp-mo-br100",
    "images": [],
    "sourceUrl": "https://www.google.com/maps/reviews/data=!4m8!14m7!1m6!2m5!1sCi9DQUlRQUNvZENodHljRjlvT2xCb1RtdDZSVGQxUkd3eVZUWTNRbFIwTUdwaE9IYxAB!2m1!1s0x0:0x2cf3ac41dfcc8b72!3m1!1s2@1:CAIQACodChtycF9oOlBoTmt6RTd1RGwyVTY3QlR0MGphOHc%7C%7C?hl=en-US"
  },
  {
    "name": "Patten Pointe Dressage",
    "location": "",
    "rating": 5,
    "date": "September 2026",
    "review": "Josiah has been performing landscaping jobs such as tree cutting, sodding, brush mowing. The best project was building a beautiful fire pit for us. He is honest, talented and hard working. I would highly recommend his company for any landscaping projects.",
    "service": "Google Review",
    "avatarUrl": "https://lh3.googleusercontent.com/a/ACg8ocKrmEAOZ7Nhyai3trphOqIHK5s2djklu0PbxzsrUP_fHyLOFA=s64-c-rp-mo-br100",
    "images": [
      "https://lh3.googleusercontent.com/grass-cs/AABkmLeIjM6OZpxavFt22nRmnTN-8L4I-PvHLBEo_WO7Ybm33oh57zBgsmeiT3QkaeYs4QmtKx1ljJ83zTjTFogrwYYvr-eDs-WpyVUfIzew_nemiKOsxmsAoUft4qtIUuRMetQa1_KBqvjgCO4X=k-no",
      "https://lh3.googleusercontent.com/grass-cs/AABkmLehPq7sr3rGJRufR_cTQI1EJwQbuB0n7bJZi9Yxt3OJp5NqBHtPoE0d9wuHXt6icvvet4WciWKzv0guu9-ZZMUzu0FkaMQjQPa46NtjxuWeSacljWeYKsbSHcKeaQXhBl6J9lQlaTSHCVM=k-no"
    ],
    "sourceUrl": "https://www.google.com/maps/reviews/data=!4m8!14m7!1m6!2m5!1sCi9DQUlRQUNvZENodHljRjlvT21SbWNGZEJaVE5CYUdWNVRFZFJhQzFyYW5sa1QwRRAB!2m1!1s0x0:0x2cf3ac41dfcc8b72!3m1!1s2@1:CAIQACodChtycF9oOmRmcFdBZTNBaGV5TEdRaC1ranlkT0E%7C%7C?hl=en-US"
  },
  {
    "name": "Bobbi Barr",
    "location": "",
    "rating": 5,
    "date": "August 2026",
    "review": "Awesome job!  Pressure washed my home and shed!",
    "service": "Google Review",
    "avatarUrl": "https://lh3.googleusercontent.com/a/ACg8ocIIaD0Et02RwULVwbiFUbD_1_Vf5-TgpxumALqY0U-RIpVCoA=s64-c-rp-mo-br100",
    "images": [],
    "sourceUrl": "https://www.google.com/maps/reviews/data=!4m8!14m7!1m6!2m5!1sCi9DQUlRQUNvZENodHljRjlvT25vNE4wVjNhMXB2UjJOdFVsSnVjMUUwUkdaTVpYYxAB!2m1!1s0x0:0x2cf3ac41dfcc8b72!3m1!1s2@1:CAIQACodChtycF9oOno4N0V3a1pvR2NtUlJuc1E0RGZMZXc%7C%7C?hl=en-US"
  },
  {
    "name": "Joe Welch",
    "location": "",
    "rating": 5,
    "date": "August 2026",
    "review": "Thank you Josiah for your amazing landscaping work at our non-profit project. I can always count on your professionalism and attention to detail. Looking forward to working together again soon.",
    "service": "Google Review",
    "avatarUrl": "https://lh3.googleusercontent.com/a/ACg8ocKFZLw4M9HULEeN1YGkOSI1258tnq-JhQjVNTSVzkvx1N46Bg=s64-c-rp-mo-br100",
    "images": [],
    "sourceUrl": "https://www.google.com/maps/reviews/data=!4m8!14m7!1m6!2m5!1sCi9DQUlRQUNvZENodHljRjlvT2xwNFlVcFhibHBSWTNndFJ6STNaMFI0ZEhWb2IxRRAB!2m1!1s0x0:0x2cf3ac41dfcc8b72!3m1!1s2@1:CAIQACodChtycF9oOlp4YUpXblpRY3gtRzI3Z0R4dHVob1E%7C%7C?hl=en-US"
  },
  {
    "name": "Steve Kelly",
    "location": "",
    "rating": 4,
    "date": "July 2026",
    "review": "Josiah worked very hard to provide excellent power washing team after one of his subs did not respond to his calls/texts leading up to our scheduled appt. He came through and it was the best job we have had in last 10 years.",
    "service": "Google Review",
    "avatarUrl": "https://lh3.googleusercontent.com/a-/ALV-UjXznfdhSqnUNXfUJo7daxvS7y76WLuG-L68KG6sD3qfRiUP5RQ=s64-c-rp-mo-br100",
    "images": [],
    "sourceUrl": "https://www.google.com/maps/reviews/data=!4m8!14m7!1m6!2m5!1sCi9DQUlRQUNvZENodHljRjlvT25sdFIzTkxjVW90VWt0clptSTBjMll6TVRGalRtYxAB!2m1!1s0x0:0x2cf3ac41dfcc8b72!3m1!1s2@1:CAIQACodChtycF9oOnltR3NLcUotUktrZmI0c2YzMTFjTmc%7C%7C?hl=en-US"
  },
  {
    "name": "Margaret Little",
    "location": "",
    "rating": 5,
    "date": "July 2026",
    "review": "We had a great experience with Firm Foundation Property Service. Josiah and his team cleared and trimmed several trees across our property and also handled some much-needed lawn maintenance quickly and thoroughly. Josiah was responsive, efficient, and easy to work with from start to finish. We trusted his team to get the job done well, and they absolutely delivered. A worthwhile investment, and we plan to use them again.",
    "service": "Google Review",
    "avatarUrl": "https://lh3.googleusercontent.com/a-/ALV-UjVg4KEGxzVVp9rX1QwKaa3JUA4YYZKwjj4MIBbv3fGHIDhLCYut=s64-c-rp-mo-br100",
    "images": [],
    "sourceUrl": "https://www.google.com/maps/reviews/data=!4m8!14m7!1m6!2m5!1sCi9DQUlRQUNvZENodHljRjlvT21ZM1JXWjRiM2hNV0VocFJteE1ZMGhhUlc5eWRHYxAB!2m1!1s0x0:0x2cf3ac41dfcc8b72!3m1!1s2@1:CAIQACodChtycF9oOmY3RWZ4b3hMWEhpRmxMY0haRW9ydGc%7C%7C?hl=en-US"
  },
  {
    "name": "Terry Weeks",
    "location": "",
    "rating": 5,
    "date": "April 2026",
    "review": "Josiah was phenomenal in helping us with property maintenance work on our commercial buildings in Mt. Pleasant. Professional, smart, hard working and he does a great job!  We will definitely use Firm Foundation for our property maintenance needs moving forward.",
    "service": "Google Review",
    "avatarUrl": "https://lh3.googleusercontent.com/a/ACg8ocJLkNi5aIGMM0xXYdO1U35_Q2ytudQAhFbbAmZx_Im3vUAZyQ=s64-c-rp-mo-br100",
    "images": [],
    "sourceUrl": "https://www.google.com/maps/reviews/data=!4m8!14m7!1m6!2m5!1sCi9DQUlRQUNvZENodHljRjlvT2tWM1FWUnJWMDFRYzFsR1VXTmFjMlUxZVZkaFluYxAB!2m1!1s0x0:0x2cf3ac41dfcc8b72!3m1!1s2@1:CAIQACodChtycF9oOkV3QVRrV01Qc1lGUWNac2U1eVdhYnc%7C%7C?hl=en-US"
  },
  {
    "name": "Andi Andrew",
    "location": "",
    "rating": 5,
    "date": "April 2026",
    "review": "Firm Foundation truly delivered exactly what I had asked and hoped for. Josiah was efficient, hard working and did a beautiful job with the landscaping projects I needed. I highly recommend Firm Foundation!",
    "service": "Google Review",
    "avatarUrl": "https://lh3.googleusercontent.com/a/ACg8ocJp1RIoyfyOJU6GwG52q5bmf2xu4qhPf_z1uBe2Pc8XFWOR3Q=s64-c-rp-mo-br100",
    "images": [],
    "sourceUrl": "https://www.google.com/maps/reviews/data=!4m8!14m7!1m6!2m5!1sCi9DQUlRQUNvZENodHljRjlvT2xWaWJ6VllkazlZZVMwMWVITjJhbTR6WkZOVlZXYxAB!2m1!1s0x0:0x2cf3ac41dfcc8b72!3m1!1s2@1:CAIQACodChtycF9oOlVibzVYdk9YeS01eHN2am4zZFNVVWc%7C%7C?hl=en-US"
  },
  {
    "name": "Tricia Harter",
    "location": "",
    "rating": 5,
    "date": "April 2026",
    "review": "I cannot say enough about the landscaping that Josiah did at our home this week! He is such a kind, respectful, hard-working, young man and I am so unbelievably grateful for the beautiful work that he did. We just moved into our home a couple months ago and it was so overgrown and hard to look at! Because of Josiah,  we are now excited to be outside and enjoy our gorgeous landscape! I recommend him 1000%.",
    "service": "Google Review",
    "avatarUrl": "https://lh3.googleusercontent.com/a-/ALV-UjVLmFNOh8FsIgkvlEiByMCfGm8z0A-RUyBgX7cPiXRlQ1FxyeSdKQ=s64-c-rp-mo-br100",
    "images": [
      "https://lh3.googleusercontent.com/grass-cs/AABkmLdMh6LgitDk1tEbBiE0ym7uBz9gFCmJPE4a6A8TeUaNX0d0W2tXrbB_EruKs261O7nJkGsU75CEtgA4hG8OOoWvL8Gx4orxwsbYYAxeDC3EEZkGlv3jenHQxwXOvt8qu7YZ5Ge71aAKlJFE=k-no",
      "https://lh3.googleusercontent.com/grass-cs/AABkmLdLLWcP_kfbK5RVfQ8SZHUKP4OQ1wn-Es96yKqlYL2PQzLEcG3Igo44OlQORe26KAYQNN70FYSNOhxJFzJphIBKLakjmFcsiNV3vIsPWWi3cU-bRh3NwVcfziTTiYaQsomS_hS9kXB1Vw0=k-no"
    ],
    "sourceUrl": "https://www.google.com/maps/reviews/data=!4m8!14m7!1m6!2m5!1sCi9DQUlRQUNvZENodHljRjlvT25OYVpHeHNUMTg0TkdsQlEwMHpTWGhQYUhoUU9IYxAB!2m1!1s0x0:0x2cf3ac41dfcc8b72!3m1!1s2@1:CAIQACodChtycF9oOnNaZGxsT184NGlBQ00zSXhPaHhQOHc%7C%7C?hl=en-US"
  }
];
