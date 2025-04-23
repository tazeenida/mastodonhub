import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import WorkshopEvents from "../components/WorkshopEvent";
import axios from "axios";

// Mock axios and localStorage
jest.mock("axios");

const mockEvent = {
  Title: "Oil Painting Workshop",
  Description: "Leadership workshops focusing on communication.",
  Location: "Kettler",
  Date: "2024-03-15",
  StartTime: "14:00:00",
  EndTime: "16:00:00",
  ImageUrl: "https://example.com/image.jpg",
  Category: "Workshops",
};

describe("WorkshopEvents", () => {
  beforeEach(() => {
    localStorage.clear();
    axios.get.mockResolvedValue({ data: [mockEvent] });
  });

  it("renders loading state initially", async () => {
    render(
      <Router>
        <WorkshopEvents />
      </Router>
    );
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it("fetches and displays workshop events", async () => {
    render(
      <Router>
        <WorkshopEvents />
      </Router>
    );

    await waitFor(() => {
      expect(screen.getByText(mockEvent.Title)).toBeInTheDocument();
      expect(screen.getByText(mockEvent.Description)).toBeInTheDocument();
    });
  });

  it("adds event to localStorage on 'Add Event'", async () => {
    render(
      <Router>
        <WorkshopEvents />
      </Router>
    );

    await waitFor(() => screen.getByText("Add Event"));

    const addButton = screen.getByText("Add Event");
    fireEvent.click(addButton);

    const storedEvents = JSON.parse(localStorage.getItem("calendarEvents"));
    expect(storedEvents).toHaveLength(1);
    expect(storedEvents[0].title).toBe(mockEvent.Title);
  });

  it("shows alert for duplicate events", async () => {
    window.alert = jest.fn();

    localStorage.setItem("calendarEvents", JSON.stringify([{ title: mockEvent.Title }]));

    render(
      <Router>
        <WorkshopEvents />
      </Router>
    );

    await waitFor(() => screen.getByText("Add Event"));

    const addButton = screen.getByText("Add Event");
    fireEvent.click(addButton);

    expect(window.alert).toHaveBeenCalledWith("Event already added.");
  });

  it("handles API error gracefully", async () => {
    axios.get.mockRejectedValue(new Error("Error fetching events"));

    render(
      <Router>
        <WorkshopEvents />
      </Router>
    );

    await waitFor(() => {
      expect(screen.getByText(/Error:/i)).toBeInTheDocument();
    });
  });

  it("opens Google Calendar with correct parameters", async () => {
    window.open = jest.fn();

    render(
      <Router>
        <WorkshopEvents />
      </Router>
    );

    await waitFor(() => screen.getByText("Add to Google Calendar"));

    const googleBtn = screen.getByText("Add to Google Calendar");
    fireEvent.click(googleBtn);

    expect(window.open).toHaveBeenCalled();
    const url = window.open.mock.calls[0][0];
    expect(url).toContain("https://www.google.com/calendar/render");
    expect(url).toContain("https://www.google.com/calendar/render?action=TEMPLATE&text=Oil+Painting+Workshop&details=Leadership+workshops+focusing+on+communication.&location=Kettler&dates=20240315T180000Z%2F20240315T200000Z");
  });

  it("filters only 'Workshops' category", async () => {
    const mockWithDifferentCategory = {
      ...mockEvent,
      Title: "Career Fair",
      Category: "Career",
    };

    axios.get.mockResolvedValue({ data: [mockEvent, mockWithDifferentCategory] });

    render(
      <Router>
        <WorkshopEvents />
      </Router>
    );

    await waitFor(() => {
      expect(screen.getByText("Oil Painting Workshop")).toBeInTheDocument();
      expect(screen.queryByText("Career Fair")).not.toBeInTheDocument();
    });
  });
});
