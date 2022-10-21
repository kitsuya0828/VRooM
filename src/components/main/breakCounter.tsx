import { Button, Center, Stack, Title, Text, Grid, Group, Progress, Card, createStyles, RingProgress, SimpleGrid } from '@mantine/core'
import { useCountdownTimer } from 'use-countdown-timer'
import shallow from 'zustand/shallow'
import { useSettingsStore } from 'src/stores/settingsStore'
import { useEffect, useRef, useState } from 'react'

const getRandomInt = (max: number) => {
  return Math.floor(Math.random() * max);
}

const useStyles = createStyles((theme) => ({
  card: {
    backgroundColor: theme.fn.primaryColor(),
    width: '100%'
  },

  title: {
    color: theme.fn.rgba(theme.white, 0.65),
  },

  stats: {
    color: theme.white,
  },

  progressBar: {
    backgroundColor: theme.white,
  },

  progressTrack: {
    backgroundColor: theme.fn.rgba(theme.white, 0.4),
  },
}));

const BreakCounter = () => {
  const { classes } = useStyles();
  const percentage = useRef(0);
  const [circle, setCircle] = useState(false);
  const { setMode, setPositionX, setPositionY, setPositionZ, setStudied, countRemain, setCountRemain, workTime, setWorkTime, breakTime, setBreakTime } = useSettingsStore(
    (state) => ({
      setMode: state.setMode,
      setPositionX: state.setPositionX,
      setPositionY: state.setPositionY,
      setPositionZ: state.setPositionZ,
      setStudied: state.setStudied,
      countRemain: state.countRemain,
      setCountRemain: state.setCountRemain,
      workTime: state.workTime,
      setWorkTime: state.setWorkTime,
      breakTime: state.breakTime,
      setBreakTime: state.setBreakTime,
    }),
    shallow,
  )
  const countRemainRef = useRef(countRemain);
  const timerSeconds = breakTime * 60;
  const { countdown, start, reset, pause, isRunning } = useCountdownTimer({
    timer: 1000 * 60,
  });

  useEffect(() => {
    start()
    const audio = new Audio("/voices/15.wav")
    audio.play()
  }, [])

  useEffect(() => {
    if (countdown===0 && isRunning === true) {
      setPositionX(0)
      setPositionY(-0.8)
      setPositionZ(0)
      setStudied(true)
      setMode('finish')
    }
    setCountRemain(countdown/1000)
    percentage.current = countdown * 100 / (timerSeconds * 1000)
  }, [isRunning, countdown])

  const timerClick = () => {
    setCircle(!circle)
    // const fileNumbers = [2, 3]
    // const audio = new Audio(`voices/${fileNumbers[getRandomInt(fileNumbers.length)]}.wav`)
    // audio.play()
  }

  return (
    <div>
      <Stack sx={() => ({ backgroundColor: 'transparent' })}>
        <Title color="blue" style={{ fontSize: '50px' }}>
            休憩中です
        </Title>
        <Text color="gray">ゆっくり休んでくださいね</Text>
        <Center onClick={() => timerClick()}>
          {circle ?
            <Card withBorder radius="md" p="xl" className={classes.card}>
              <Text size="xs" weight={700} className={classes.title}>
                REMAINING
              </Text>
              <Title weight={500} className={classes.stats}>
                {new Date(countdown).toISOString().slice(14, 19)}
              </Title>

              <Progress
                value={percentage.current}
                mt="md"
                size="lg"
                radius="xl"
                classNames={{
                  root: classes.progressTrack,
                  bar: classes.progressBar
                }}
              />
              <Group position="left">
                <Text size="xs" color="white">
                  あと {Math.trunc(percentage.current)}%
                </Text>
              </Group>
            </Card>
            :
            <RingProgress
            label={
              <div>
                <Text size="xs" weight={700} align="center">
                  REMAINING
                </Text>
                <Title weight={500} align="center">
                  {new Date(countdown).toISOString().slice(14, 19)}
                </Title>
                <Text size="xs" color="gray" align="center">
                  あと {Math.trunc(percentage.current)}%
                </Text>
              </div>
            }
            size={240}
            thickness={16}
            roundCaps
            sections={[
              { value: percentage.current, color: 'blue' },
            ]}
          />
          }
        </Center>
        <Stack align="flex-end">
          <Button variant="default" onClick={() => setMode("finish")} >休憩を終了する</Button>
        </Stack>
      </Stack>
    </div>
  );
}

export default BreakCounter