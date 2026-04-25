# Image Prompts – Admin Dashboard API Guide

Admins can view and edit the **image generation prompts** used by the backend for **story illustrations** and **song/album cover** images. These prompts are stored in the database; there is no fallback to hardcoded text. If a prompt is missing, story/song image generation will fail.

---

## Overview

- **Story image prompt** (`story_image`): Template used to generate each story scene illustration. One prompt per image; placeholders are filled per scene (style, scene text, consistency note, etc.).
- **Album cover prompt** (`album_cover`): Template used to generate the song album cover image. Placeholders are filled from the song (title, characters, places, items, theme, time of day).
- Placeholders in templates use either `(variable name)` or `{variable_name}`. The backend substitutes these when generating images.

---

## Authentication

All admin endpoints require:

- **Header:** `Authorization: Bearer <admin_access_token>` or `x-auth-token: <admin_access_token>`
- Admin user must have the **managePrompts** right.

---

## Base URL

Use your backend base URL, e.g. `https://your-api.com` or `http://localhost:3000`. All paths below are relative to that (e.g. `/api/prompts/...`).

---

## Admin Endpoints

### 1. Get image prompts (story_image & album_cover)

**GET** `/api/prompts/image-prompts`

**Auth:** Admin with `managePrompts`

**Response (200):**

```json
{
  "code": 200,
  "message": "Image prompts retrieved",
  "data": {
    "story_image": {
      "_id": "...",
      "promptKey": "story_image",
      "systemPrompt": "(style description) based on this scene: (scene text)...",
      "variables": ["style_description", "scene_text", "consistency_note", "title", "description"],
      "createdAt": "...",
      "updatedAt": "..."
    },
    "album_cover": {
      "_id": "...",
      "promptKey": "album_cover",
      "systemPrompt": "CARTOON ILLUSTRATION ONLY... (song title)...",
      "variables": ["song_title", "characters_list", "places_list", "items_list", "theme_words", "time_of_day"],
      "createdAt": "...",
      "updatedAt": "..."
    }
  }
}
```

Either `story_image` or `album_cover` may be `null` if that prompt has not been seeded yet. The UI should handle null and show a message that the prompt needs to be seeded (run `npm run seed:image-prompts` on the backend once).

---

### 2. Update an image prompt

**PATCH** `/api/prompts/image-prompts/:key`

**Auth:** Admin with `managePrompts`

**URL parameter:**

| Param | Description |
|-------|--------------|
| `key` | One of: `story_image`, `album_cover` |

**Content-Type:** `application/json` or `multipart/form-data` with `upload.none()` (no file upload).

**Body (JSON):**

| Field         | Type   | Required | Description |
|---------------|--------|----------|-------------|
| systemPrompt  | string | Yes      | Full prompt template. Use placeholders as documented below. |

**Example (cURL):**

```bash
curl -X PATCH "https://your-api.com/api/prompts/image-prompts/story_image" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"systemPrompt\": \"(style description) based on this scene: (scene text). (consistency note) Bright and child-friendly. No text in image.\"}"
```

**Response (200):**

```json
{
  "code": 200,
  "message": "Image prompt updated",
  "data": {
    "prompt": {
      "_id": "...",
      "promptKey": "story_image",
      "systemPrompt": "...",
      "variables": ["style_description", "scene_text", "consistency_note"],
      "createdAt": "...",
      "updatedAt": "..."
    }
  }
}
```

**Errors:**

- **400** – Invalid `key` (not `story_image` or `album_cover`). Body message: `Invalid key. Use one of: story_image, album_cover`.
- **404** – Prompt not found for that key (e.g. not seeded). Body message: `Prompt not found`.

---

### 3. Alternative: Update by prompt key (generic prompts API)

You can also update any prompt (including image prompts) using the generic prompt update endpoint:

**PATCH** `/api/prompts/:promptKey`

**Auth:** Admin with `managePrompts`

**URL parameter:** `promptKey` = `story_image` or `album_cover`

**Body:** Same as above: `{ "systemPrompt": "..." }`.

Behavior and response shape are the same as **PATCH** `/api/prompts/image-prompts/:key`. Use whichever fits your admin UI (dedicated “Image prompts” screen vs generic “Prompts” screen).

---

## Placeholders (variables) per prompt

Admin-editable templates can use these placeholders. The backend fills them when generating images. Use either `(variable name)` with spaces or `{variable_name}` with underscores.

### story_image

Used once per story scene. Do not remove placeholders; the backend expects them.

| Placeholder in template | Description |
|-------------------------|-------------|
| `(style description)` or `{style_description}` | Visual style for this image (e.g. “colorful cartoon”). |
| `(scene text)` or `{scene_text}` | The scene narrative snippet. |
| `(consistency note)` or `{consistency_note}` | Note for character/setting consistency across images. |
| `(title)` or `{title}` | Story title (optional). |
| `(description)` or `{description}` | Story description (optional). |

**Example snippet:**  
`(style description) based on this scene: (scene text). (consistency note) Bright, cheerful, suitable for children. No text in image.`

---

### album_cover

Used once per song to build the album cover description.

| Placeholder in template | Description |
|-------------------------|-------------|
| `(song title)` or `{song_title}` | Title of the song. |
| `(characters list)` or `{characters_list}` | Comma-separated characters from the song (e.g. “dragon, witch”). |
| `(places list)` or `{places_list}` | Comma-separated places (e.g. “forest, castle”). |
| `(items list)` or `{items_list}` | Comma-separated items (e.g. “magic ring, book”). |
| `(theme words)` or `{theme_words}` | Theme/mood words. |
| `(time of day)` or `{time_of_day}` | Time of day (e.g. “sunset”, “morning”). |

Any of these may be empty if the backend has no data (e.g. no characters in the song). The template should still read naturally when a placeholder is replaced with an empty string.

---

## Suggested admin UI

1. **Image prompts screen**  
   - **GET** `/api/prompts/image-prompts` on load.  
   - Show two sections (or tabs): “Story image prompt” and “Album cover prompt”.  
   - Display `systemPrompt` in a large text area; optionally show `variables` as read-only hints.  
   - Save per prompt via **PATCH** `/api/prompts/image-prompts/story_image` or `.../album_cover` with `{ systemPrompt }`.

2. **Validation**  
   - You may warn if the user removes a placeholder that appears in the default seed (e.g. `(scene text)`, `(song title)`), but the API does not enforce this. Missing placeholders are replaced with empty string by the backend.

3. **Seeding**  
   - If `story_image` or `album_cover` is `null` from GET, show a message that the backend admin must run `npm run seed:image-prompts` once to create default prompts.

---

## Summary

| Action              | Method | Endpoint                                | Body / params |
|---------------------|--------|-----------------------------------------|----------------|
| Get image prompts   | GET    | `/api/prompts/image-prompts`            | —              |
| Update story image  | PATCH  | `/api/prompts/image-prompts/story_image`  | `{ systemPrompt }` |
| Update album cover  | PATCH  | `/api/prompts/image-prompts/album_cover`  | `{ systemPrompt }` |
| Update by key       | PATCH  | `/api/prompts/:promptKey`               | `{ systemPrompt }`, `promptKey` = `story_image` or `album_cover` |

All require **managePrompts** and `Authorization: Bearer <token>` or `x-auth-token`.
