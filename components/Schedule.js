import { Divider, Modal, Grid, Page, Text, useTheme } from "@geist-ui/core";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  XCircle,
} from "@geist-ui/icons";
import { addDays, format, startOfWeek } from "date-fns";


const Schedule = ({isCalendarVisible, calendarOnClose}) => {
  const { palette } = useTheme();

  const firstWeek = startOfWeek(new Date());
  const weekDay = Array.from(Array(7)).map((e, item) =>
    format(addDays(firstWeek, item), "EEE")
  );

  return (
      <div>
        <div className="container">
          <Text font="12px" type="secondary">
            DATE RANGE
          </Text>
          <div className="row">
            <Text font="20px" b>
              12/08/2021
              <Text font="20px" type="secondary" b>
                {` – `}
              </Text>
              12/15/2021
            </Text>
            <XCircle size={18} color={palette.secondary} />
          </div>
          <Divider
            className="divider"
            style={{
              margin: "10px -12px",
              maxWidth: 300,
            }}
          />
          <div className="row">
            <Text font="12px" className="text-month">
              DECEMBER 2021
            </Text>
            <div className="row">
              <Grid.Container gap={1.5} justify="center">
                <Grid>
                  <ChevronLeft size={20} color={palette.secondary} />
                </Grid>
                <Grid>
                  <Calendar size={18} color={palette.secondary} />
                </Grid>
                <Grid>
                  <ChevronRight size={20} color={palette.secondary} />
                </Grid>
              </Grid.Container>
            </div>
          </div>
          <Divider className="divider" />
          {weekDay.map((day) => (
            <th key={day} className="week-day">
              <Text type="secondary" font="12px">
                {day}
              </Text>
            </th>
          ))}
        </div>
        <style jsx>{`
          .container {
            width: 300px;
            height: 400px;
            padding: 12px;
            background: #fffc;
            box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
            border-radius: 5px;
          }
          .row {
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
          }
          .week-day {
            padding: 0 8px;
            font-weight: 500 !important;
            text-transform: uppercase;
          }
        `}</style>
        </div>
  );
};

export default Schedule;