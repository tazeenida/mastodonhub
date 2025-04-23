import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import SportsEvents from "../components/SportsEvents";
import axios from "axios";

// Mocks
jest.mock("axios");
window.alert = jest.fn();
window.open = jest.fn();

describe("SportsEvents", () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  it("renders loading state initially", () => {
    axios.get.mockResolvedValue({ data: [] });

    render(
      <Router>
        <SportsEvents />
      </Router>
    );

    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it("fetches and displays events correctly", async () => {
    const mockEvents = [
      {
        Title: "Football Match",
        Description: "Watch an exciting football match!",
        Location: "Stadium",
        Date: "2024-04-27",
        StartTime: "19:00:00",
        EndTime: "22:00:00",
        ImageUrl: "https://example.com/football.jpg",
        Category: "Sports",
      },
    ];

    axios.get.mockResolvedValue({ data: mockEvents });

    render(
      <Router>
        <SportsEvents />
      </Router>
    );

    expect(await screen.findByText("Football Match")).toBeInTheDocument();
    expect(screen.getByText(/Watch an exciting football match!/)).toBeInTheDocument();
  });

  it("adds event to localStorage when 'Add Event' is clicked", async () => {
    const event = {
      Title: "Football Match",
      Description: "Exciting match",
      Location: "Stadium",
      Date: "2024-04-27",
      StartTime: "19:00:00",
      EndTime: "22:00:00",
      ImageUrl: "https://example.com/football.jpg",
      Category: "Sports",
    };

    axios.get.mockResolvedValue({ data: [event] });

    render(
      <Router>
        <SportsEvents />
      </Router>
    );

    const addButton = await screen.findByText(/Add Event/i);
    fireEvent.click(addButton);

    const stored = JSON.parse(localStorage.getItem("calendarEvents"));
    expect(stored).toHaveLength(1);
    expect(stored[0].title).toBe("Football Match");
    expect(window.alert).toHaveBeenCalledWith("Event successfully added.");
  });

  it("alerts if event already exists in localStorage", async () => {
    const event = {
      Title: "Football Match",
      Description: "Exciting match",
      Location: "Stadium",
      Date: "2024-04-27",
      StartTime: "19:00:00",
      EndTime: "22:00:00",
      ImageUrl: "https://example.com/football.jpg",
      Category: "Sports",
    };

    localStorage.setItem("calendarEvents", JSON.stringify([{ title: "Football Match" }]));
    axios.get.mockResolvedValue({ data: [event] });

    render(
      <Router>
        <SportsEvents />
      </Router>
    );

    const addButton = await screen.findByText(/Add Event/i);
    fireEvent.click(addButton);

    expect(window.alert).toHaveBeenCalledWith("Event already added.");
  });

  it("handles API error gracefully", async () => {
    axios.get.mockRejectedValue(new Error("Error fetching events"));

    render(
      <Router>
        <SportsEvents />
      </Router>
    );

    expect(await screen.findByText(/Error fetching events/i)).toBeInTheDocument();
  });

  it("alerts if Google Calendar event has invalid date/time", async () => {
    const event = {
      Title: "Invalid Event",
      Description: "Broken time",
      Location: "Nowhere",
      Date: "invalid-date",
      StartTime: "99:99",
      EndTime: "10:00",
      ImageUrl: "https://example.com/broken.jpg",
      Category: "Sports",
    };

    axios.get.mockResolvedValue({ data: [event] });

    render(
      <Router>
        <SportsEvents />
      </Router>
    );

    const calendarBtn = await screen.findByText(/Add to Google Calendar/i);
    fireEvent.click(calendarBtn);

    expect(window.alert).toHaveBeenCalledWith("Invalid event date or time.");
  });
});
