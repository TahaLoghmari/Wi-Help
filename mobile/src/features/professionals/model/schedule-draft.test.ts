import {
  createInitialScheduleDraft,
  isScheduleDraftDirty,
  scheduleDraftReducer,
} from "./schedule-draft";

const mondayFromServer = (startTime = "09:00", endTime = "10:00") => [
  {
    dayOfWeek: "Monday",
    isActive: true,
    availabilitySlots: [{ id: "slot-1", startTime, endTime }],
  },
];

describe("scheduleDraftReducer", () => {
  it("starts with all seven inactive days", () => {
    const state = createInitialScheduleDraft();

    expect(state.professionalId).toBeNull();
    expect(state.days).toEqual(
      [0, 1, 2, 3, 4, 5, 6].map((dayOfWeek) => ({
        dayOfWeek,
        isActive: false,
        availabilitySlots: [],
      })),
    );
    expect(isScheduleDraftDirty(state)).toBe(false);
  });

  it("loads and normalizes a server schedule", () => {
    const state = scheduleDraftReducer(createInitialScheduleDraft(), {
      type: "serverLoaded",
      professionalId: "professional-1",
      days: mondayFromServer("9:00:00 AM", "10:00:00 AM"),
    });

    expect(state.professionalId).toBe("professional-1");
    expect(state.days).toHaveLength(7);
    expect(state.days[1]).toEqual({
      dayOfWeek: 1,
      isActive: true,
      availabilitySlots: [
        { id: "slot-1", startTime: "09:00", endTime: "10:00" },
      ],
    });
    expect(state.savedDays).toEqual(state.days);
    expect(isScheduleDraftDirty(state)).toBe(false);
  });

  it("preserves edits when the same professional is refetched", () => {
    let state = scheduleDraftReducer(createInitialScheduleDraft(), {
      type: "serverLoaded",
      professionalId: "professional-1",
      days: mondayFromServer(),
    });
    state = scheduleDraftReducer(state, {
      type: "slotEdited",
      dayOfWeek: 1,
      slotIndex: 0,
      startTime: "10:00",
      endTime: "11:00",
    });

    state = scheduleDraftReducer(state, {
      type: "serverLoaded",
      professionalId: "professional-1",
      days: mondayFromServer("14:00", "15:00"),
    });

    expect(state.days[1]?.availabilitySlots[0]).toEqual({
      id: "slot-1",
      startTime: "10:00",
      endTime: "11:00",
    });
    expect(state.savedDays[1]?.availabilitySlots[0]).toEqual({
      id: "slot-1",
      startTime: "14:00",
      endTime: "15:00",
    });
    expect(isScheduleDraftDirty(state)).toBe(true);
  });

  it("replaces the draft when a different professional is loaded", () => {
    let state = scheduleDraftReducer(createInitialScheduleDraft(), {
      type: "serverLoaded",
      professionalId: "professional-1",
      days: mondayFromServer(),
    });
    state = scheduleDraftReducer(state, {
      type: "slotEdited",
      dayOfWeek: 1,
      slotIndex: 0,
      startTime: "10:00",
      endTime: "11:00",
    });

    state = scheduleDraftReducer(state, {
      type: "serverLoaded",
      professionalId: "professional-2",
      days: [],
    });

    expect(state.professionalId).toBe("professional-2");
    expect(state.days.every((day) => !day.isActive)).toBe(true);
    expect(state.savedDays).toEqual(state.days);
    expect(isScheduleDraftDirty(state)).toBe(false);
  });

  it("adds a default slot when activated and preserves slots across toggles", () => {
    let state = scheduleDraftReducer(createInitialScheduleDraft(), {
      type: "dayToggled",
      dayOfWeek: 1,
    });

    expect(state.days[1]).toEqual({
      dayOfWeek: 1,
      isActive: true,
      availabilitySlots: [{ startTime: "09:00", endTime: "10:00" }],
    });

    state = scheduleDraftReducer(state, {
      type: "dayToggled",
      dayOfWeek: 1,
    });
    state = scheduleDraftReducer(state, {
      type: "dayToggled",
      dayOfWeek: 1,
    });

    expect(state.days[1]).toEqual({
      dayOfWeek: 1,
      isActive: true,
      availabilitySlots: [{ startTime: "09:00", endTime: "10:00" }],
    });
  });

  it("adds, edits, and deletes slots without losing existing IDs", () => {
    let state = scheduleDraftReducer(createInitialScheduleDraft(), {
      type: "serverLoaded",
      professionalId: "professional-1",
      days: [
        {
          dayOfWeek: "Monday",
          isActive: true,
          availabilitySlots: [
            { id: "slot-1", startTime: "09:00", endTime: "10:00" },
            { id: "slot-2", startTime: "11:00", endTime: "12:00" },
          ],
        },
      ],
    });

    state = scheduleDraftReducer(state, {
      type: "slotAdded",
      dayOfWeek: 1,
      startTime: "13:00",
      endTime: "14:00",
    });
    state = scheduleDraftReducer(state, {
      type: "slotEdited",
      dayOfWeek: 1,
      slotIndex: 0,
      startTime: "09:30",
      endTime: "10:30",
    });
    state = scheduleDraftReducer(state, {
      type: "slotDeleted",
      dayOfWeek: 1,
      slotIndex: 1,
    });

    expect(state.days[1]?.availabilitySlots).toEqual([
      {
        id: "slot-1",
        startTime: "09:30",
        endTime: "10:30",
      },
      { startTime: "13:00", endTime: "14:00" },
    ]);
  });

  it("returns the same state for invalid day and slot operations", () => {
    const state = createInitialScheduleDraft();
    const invalidActions = [
      { type: "dayToggled" as const, dayOfWeek: 7 },
      {
        type: "slotAdded" as const,
        dayOfWeek: -1,
        startTime: "09:00",
        endTime: "10:00",
      },
      {
        type: "slotEdited" as const,
        dayOfWeek: 1,
        slotIndex: 0,
        startTime: "09:00",
        endTime: "10:00",
      },
      { type: "slotDeleted" as const, dayOfWeek: 1, slotIndex: -1 },
    ];

    for (const action of invalidActions) {
      expect(scheduleDraftReducer(state, action)).toBe(state);
    }
  });

  it("ignores inactive slots when determining whether the draft is dirty", () => {
    let state = scheduleDraftReducer(createInitialScheduleDraft(), {
      type: "slotAdded",
      dayOfWeek: 1,
      startTime: "09:00",
      endTime: "10:00",
    });

    expect(isScheduleDraftDirty(state)).toBe(false);

    state = scheduleDraftReducer(state, {
      type: "dayToggled",
      dayOfWeek: 1,
    });
    expect(isScheduleDraftDirty(state)).toBe(true);

    state = scheduleDraftReducer(state, {
      type: "dayToggled",
      dayOfWeek: 1,
    });
    expect(isScheduleDraftDirty(state)).toBe(false);
  });

  it("marks only the submitted snapshot saved when edits race with save success", () => {
    let state = scheduleDraftReducer(createInitialScheduleDraft(), {
      type: "serverLoaded",
      professionalId: "professional-1",
      days: mondayFromServer(),
    });
    state = scheduleDraftReducer(state, {
      type: "slotEdited",
      dayOfWeek: 1,
      slotIndex: 0,
      startTime: "10:00",
      endTime: "11:00",
    });
    const submittedDays = state.days;

    state = scheduleDraftReducer(state, {
      type: "slotEdited",
      dayOfWeek: 1,
      slotIndex: 0,
      startTime: "12:00",
      endTime: "13:00",
    });
    state = scheduleDraftReducer(state, {
      type: "saveSucceeded",
      submittedDays,
    });

    expect(state.savedDays[1]?.availabilitySlots[0]?.startTime).toBe("10:00");
    expect(state.days[1]?.availabilitySlots[0]?.startTime).toBe("12:00");
    expect(isScheduleDraftDirty(state)).toBe(true);
  });
});
