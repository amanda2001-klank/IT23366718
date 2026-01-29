# IT23366718 - IT3040 Assignment 1 (Semester 2, Year 3)

**BSc (Hons) in Information Technology**  
**SLIIT – Sri Lanka Institute of Information Technology**  
**Module: IT3040 – IT Project Management (ITPM)**  
**Option 1: Singlish → Sinhala Conversion Testing**  
**Student: IT23366718 (K.L.A.N.Kariyawasam)**  
**GitHub Repository:** https://github.com/amanda2001-klank/IT23366718

## Project Overview

This repository contains **Playwright automation tests** for Assignment 1 (IT3040 – ITPM, Semester 1).  

The tests evaluate the real-time transliteration accuracy and UI stability of the online tool:  
**https://www.swifttranslator.com/**  
(Singlish input → Sinhala output)

**Scope** (as per assignment):
- No backend API, performance, load, or security testing
- Focus on functional accuracy and UI behavior (real-time update, formatting preservation)

**Test Coverage**:
- **24 Positive Functional scenarios** (Pos_Fun_0001 to Pos_Fun_0024) → correct conversions
- **10 Negative Functional scenarios** (Neg_Fun_0001 to Neg_Fun_0010) → failure/edge cases
- **1 Positive UI scenario** (Pos_UI_0001) → multi-line formatting preservation

All test cases are documented in:  
**IT23366718-TestCases.xlsx** (includes Input, Expected, Actual, Status, Justification, and "What is covered" column per Appendix 2)

## Features Tested (as required)

- Sentence structures (simple, compound, complex)
- Interrogative & imperative forms
- Positive & negative sentence forms
- Daily language usage, greetings, requests, responses
- Polite vs informal phrasing
- Word combinations, joined vs segmented words, repeated emphasis
- Tense variations (past, present, future)
- Negation patterns, pronoun/plural variations
- Mixed Singlish + English (technical terms, places, abbreviations)
- Punctuation, currency, time, dates, units
- Multiple spaces, line breaks, long paragraphs
- Slang & colloquial phrasing

## Prerequisites

- Node.js (LTS recommended – v18 or v20+)
- npm (comes with Node.js)
- Git

## Setup Instructions

1. Clone this repository:

   ```bash
   git clone https://github.com/amanda2001-klank/IT23366718.git
   cd IT23366718