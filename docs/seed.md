# Wayfarer Seed Data

## Overview

This document describes the initial dataset used to populate the Wayfarer
database during development. The authoritative seed data is defined in
`apps/api/prisma/seed.ts`.

The seed data is designed to satisfy the data requirements while providing
enough variation to demonstrate the application's core functionality.

The dataset includes three users for the acting-as user switcher, five
categories for filtering places, ten places across those categories, reviews
with different ratings and review counts, tour slots with different
capacities, and existing bookings that produce different slot availability
states.

The place descriptions, review texts, and other sample content are
illustrative placeholders created for development and testing. They should
not be interpreted as actual visitor feedback or verified information about
the listed places.

## Notes on Review Distribution

Reviews are distributed across all ten places with different review counts
and rating averages.

The distribution is intentional. It provides the data needed to exercise
the ranking behavior described in `docs/DECISIONS.md`, specifically the
two ranking behavior factors:

1. **Target rating relative to the overall average.** The dataset includes
   places with ratings above and below the overall average, so the ranking
   can show how the difference between a place's rating and the reference
   average affects its score.
2. **Review count differences between places.** The dataset includes a
   place with one review, a place with two reviews, and places with three
   reviews, with different average ratings. This makes it possible to
   compare a place with more reviews but a lower average against places
   with fewer reviews but a higher average.

Together, these cases demonstrate that having more reviews does not
automatically outrank a higher-rated place with fewer reviews, while a
place with more reviews and a sufficiently high rating can still outrank
a single 5-star review.

The ratings use a mix of 3, 4, and 5 so the dataset is not made up almost
entirely of near-identical high averages. Each user has at most one review
per place, respecting the unique `(place_id, user_id)` constraint.
