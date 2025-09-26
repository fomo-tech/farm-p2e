import { Drawer, Tabs } from 'antd'
import requestService from 'api/request'
import { formatNumber } from 'lib/helpers'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import MemberItem from '../MemberItem'
import close_icon from 'assets/img_custom/clolor_dialog_close.png'

interface Props {
  setOpen: (val: boolean) => void,
  open: boolean,

}

const TeamInvite = ({ open, setOpen }: Props) => {
  const { t } = useTranslation()
  const [summary, setSummary] = useState<any>()
  const [showInfoAgency, setShowInfoAgency] = useState(false)


  const getSummaryTeam = async () => {
    try {
      const res = await requestService.get('/profile/summary-team')
      if (res && res?.data) {
        setSummary(res.data?.data)
      }

    } catch (error) {
      console.log('====================================');
      console.log(error);
      console.log('====================================');
    }
  }

  useEffect(() => {
    getSummaryTeam()
  }, [])
  return (
    <Drawer
      title={
        <div className='text-center text-[#fff]'>
          {t("TEAM")}
        </div>
      }
      className='bg_custom_drawer'
      placement={'right'}
      style={{
        background: "#fff"
      }}
      closable={true}
      closeIcon={
        <img src={close_icon} width={50} />
      }
      onClose={() => setOpen(false)}
      width="100rem"
      open={open}

    >
      <div data-v-d324c76e="" className="team-page">

        <div data-v-d324c76e="" className="team-header">
          <div data-v-d324c76e="" className="team-card">
            <div data-v-d324c76e="" className="team-overview">
              <div data-v-d324c76e="" className="total-count">
                <span data-v-d324c76e="" className="label">
                  {t("Total team members")}
                </span>
                <span data-v-d324c76e="" className="value">
                  {summary?.totalTeamMembers}
                </span>
              </div>
              <div data-v-d324c76e="" className="level-counts">
                <div data-v-d324c76e="" className="level-item">
                  <span data-v-d324c76e="" className="value">
                    {summary?.levelA?.length}
                  </span>
                  <span data-v-d324c76e="" className="label">
                    Level A
                  </span>
                </div>
                <div data-v-d324c76e="" className="level-item">
                  <span data-v-d324c76e="" className="value">
                    {summary?.levelB?.length}
                  </span>
                  <span data-v-d324c76e="" className="label">
                    Level B
                  </span>
                </div>
                <div data-v-d324c76e="" className="level-item">
                  <span data-v-d324c76e="" className="value">
                    {summary?.levelC?.length}
                  </span>
                  <span data-v-d324c76e="" className="label">
                    Level C
                  </span>
                </div>
              </div>
            </div>
            <div data-v-d324c76e="" className="team-earnings">
              <div data-v-d324c76e="" className="earning-item">
                <span data-v-d324c76e="" className="value">
                  {formatNumber(summary?.totalEarningValue?.toLocaleString())}
                </span>
                <span data-v-d324c76e="" className="label">
                  {t("Total earnings")}
                </span>
              </div>
              <div data-v-d324c76e="" className="earning-item">
                <span data-v-d324c76e="" className="value">
                  {formatNumber(summary?.totalEarningValueToday?.toLocaleString())}
                </span>
                <span data-v-d324c76e="" className="label">
                  {t("Today's earnings")}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div data-v-d324c76e="" className="team-content">
          <Tabs
            defaultActiveKey="a"

            className='tab-team'
            size='large'
            centered
            items={[
              {
                key: "a",
                label: "Level A",
                children: <div>
                  <div data-v-d324c76e="" className="member-list">
                    {
                      summary?.levelA?.map((i: any, index: number) => (
                        <MemberItem {...i} key={index} />
                      ))
                    }
                    {
                      !summary?.levelA?.length &&
                      <div className='text-center text-[#ccc]'>No Member</div>
                    }

                  </div>

                </div>,
              },
              {
                key: "b",
                label: "Level B",
                children: <div>
                  <div data-v-d324c76e="" className="member-list">
                    {
                      summary?.levelB?.map((i: any, index: number) => (
                        <MemberItem {...i} key={index} />
                      ))
                    }

                    {
                      !summary?.levelB?.length &&
                      <div className='text-center text-[#ccc]'>No Member</div>
                    }

                  </div>

                </div>,
              },
              {
                key: "c",
                label: "Level C",
                children: <div>
                  <div data-v-d324c76e="" className="member-list">
                    {
                      summary?.levelC?.map((i: any, index: number) => (
                        <MemberItem {...i} key={index} />
                      ))
                    }
                    {
                      !summary?.levelC?.length &&
                      <div className='text-center text-[#ccc]'>No Member</div>
                    }


                  </div>

                </div>,
              },
            ]}

          />

        </div>

      </div>

    </Drawer>
  )
}

export default TeamInvite