import React, {
  useState,
  FunctionComponent,
  useEffect,
  useContext,
} from 'react';
import _ from 'lodash';
import { Drawer, Button, Input, Collapse, Popconfirm, message } from 'antd';
import { Fab } from '@material-ui/core';
import {
  Group,
  CloseRounded,
  GroupAdd,
  RemoveCircleOutline,
  AddCircleOutline,
} from '@material-ui/icons';

import { auth, database } from '../../firebase';
import {
  MemberList,
  getTeamListAPI,
  MemberListEntries,
} from '../Calendar/CalendarType';

import { AuthContext } from '../../Context/AuthContext';
import { useDispatch } from 'react-redux';

interface Props {
  sdOnClose: () => void;
  sdVisible: boolean;
}
type SideDrawStatus = 'list-group' | 'add-group';

const { Panel } = Collapse;

const ManageGroup: FunctionComponent<Props> = (props) => {
  const { sdOnClose, sdVisible } = props;
  const context = useContext(AuthContext);
  const dispatch = useDispatch();
  const [sideDrawBD, setSideDrawBD] = useState<SideDrawStatus>('list-group');
  const [inputN, setInputN] = useState<number>(3); // how many input element
  const [inputNvalue, setInputNvalue] = useState<string[]>([]); // value in each input
  const [teamList, setTeamList] = useState<getTeamListAPI[]>([]); // teamlist object before POST
  const [GroupNameValue, setGroupNameValue] = useState<string>('');
  const [GroupNameError, setGroupNameError] = useState<boolean>(true);

  useEffect(() => {
    // PREVENT INVOKE FROM FIRST RENDER , context = undefined
    // @second render .Send request API
    // console.log(auth.currentUser);
    if (auth.currentUser !== null) {
      database
        .ref('users/' + auth.currentUser.uid + '/team')
        .on('value', (snapshot) => {
          // console.log('setTeamListFromFirebase;', snapshot.val());
          setTeamList(snapshot.val());
        });
    }
  }, [context]);

  useEffect(() => {
    dispatch({ type: 'UPDATE_TEAM_LIST', payload: teamList });
  }, [teamList, dispatch]);

  /**
  |--------------------------------------------------
  | FUNCTION
  |--------------------------------------------------
  */

  /* CLEAR STATE TO DEFAULT */
  const clearAfterSuccessPost = (): void => {
    setInputN(3);
    setInputNvalue([]);
    setGroupNameValue('');
    setGroupNameError(true);
    setSideDrawBD('list-group');
  };

  /* ON CLOSE SIDEDRAW */
  const onCloseSideDraw = (): void => {
    sdOnClose();
    clearAfterSuccessPost();
  };

  /**
   * TEAMNAME INPUT AND GROUPNAME INPUT *****
   */

  /* GROUP NAME STATE VALUE */
  const groupNameHandler = (e: { target: HTMLInputElement }): void => {
    setGroupNameValue(e.target.value);
    setGroupNameError(true);
  };

  const getInputValue = (
    e: { target: HTMLInputElement },
    key: number
  ): void => {
    setInputNvalue((state) => {
      let data = [...state];
      data[key] = e.target.value;
      return data;
    });
  };

  const AddMemberInput = (): any[] => {
    let loop: number = inputN;
    const InputStack: any[] = [];
    for (let i: number = 0; i < loop; i++) {
      InputStack.push(
        <Input
          className="group-input"
          placeholder={(i + 1).toString()}
          key={i}
          onChange={(e) => getInputValue(e, i)}
        ></Input>
      );
    }
    return InputStack;
  };

  const deleteMemberRow = (): void => {
    if (inputN === 3) {
      // only 1 member input left
      return;
    }
    const strPos: number = inputN - 1;
    setInputNvalue((state) => {
      let data = [...state];
      data = data.filter((value, index) => index !== strPos);
      return data;
    });
    setInputN((state) => state - 1);
  };

  const summaryNewGroup = (): void => {
    const NewGroupValueAr: string[] = _.compact(inputNvalue);
    const NewGroupValueObj: MemberList = { person: [] };

    /* MAKE HEADER OF WORKSHEET TABLE DATA **important */
    NewGroupValueAr.map((el, index) => {
      return NewGroupValueObj.person.push({
        key: index + 1,
        name: el,
        schedule: {
          row: index + 1,
          column: [],
        },
      });
    });
    // console.log(NewGroupValueAr);
    // console.log(NewGroupValueObj);

    /* MAIN FUNCTION - SET DATA */
    var AllInputNoValue: boolean = false; // check if every Input has no value
    (function valuedateInputValue() {
      for (const value of inputNvalue) {
        if (value === '' || value === undefined) {
          AllInputNoValue = true;
          break;
        }
      }
    })();
    // console.log(GroupNameValue);
    // console.log(AllInputNoValue);
    // console.log(inputNvalue);
    if (!GroupNameValue || inputNvalue.length < 3 || AllInputNoValue) {
      // console.log('error step 1');
      if (GroupNameValue) {
        // console.log('error step 2');
        // has teamname but no member in any input
        setGroupNameError(true); // hide span error text but still return
      } else {
        setGroupNameError(false); // span error
      }
      return;
    } else {
      /* POST */
      const UID: string = context?.loginStatus.uid;
      const ref = database.ref(`users/${UID}/team/${GroupNameValue}`);
      ref.set(
        {
          groupList: NewGroupValueObj,
        },
        (err) => {
          if (err) {
            alert('please contact oosamuoo02@gmail.com');
          } else {
            clearAfterSuccessPost();
          }
        }
      );
    }
  };

  const deleteGroup = (teamname: string) => {
    const UID: string = context?.loginStatus.uid;
    const ref = database.ref(`users/${UID}/team/${teamname}`);
    ref
      .remove()
      .then((snapshot) => message.success(`Delete group ${teamname}`, 3));
  };

  /**
  |--------------------------------------------------
  | FUNCTION TO JSX
  |--------------------------------------------------
  */
  /* TEAMLIST WITH CHILD APPEND ELEMENT */
  const renderTeamList = (): any => {
    if (teamList.length !== 0) {
      const PanelElement: any[] = []; // return Panel in collapse
      let i: number = 1; // loop for key
      for (const [teamName, child] of Object.entries(teamList)) {
        const MemberNameAr: any[] = []; // data from loop membername in side each entries
        let MemberName: MemberListEntries = child; // get Array data for member name pack
        (function childValue() {
          for (let i of MemberName.groupList.person) {
            MemberNameAr.push(
              <p className="p--memberlist">
                {i.key}. {i.name}
              </p>
            ); //push every membername
          }
        })();
        //push every Teamname
        PanelElement.push(
          <Panel header={teamName} key={i}>
            <p>{MemberNameAr.map((el) => el)}</p>
            <Popconfirm
              title="Delete group ?"
              onConfirm={() => deleteGroup(teamName)}
              onCancel={() => {}}
              okText="Yes"
              cancelText="No"
              placement="right"
            >
              <Button type="link" className="btn-groupdelete" danger>
                DELETE
              </Button>
            </Popconfirm>
          </Panel>
        );
        i++; // key++
      }
      return <Collapse>{PanelElement.map((el) => el)}</Collapse>;
    }
  };

  /**
  |--------------------------------------------------
  | SIDEDRAWER COMPONENT
  |--------------------------------------------------
  */
  const SideDrawHeader = (
    <div className="sidedrawer__header">
      <p className="p--group">Group</p>
      <div className="sidedrawer__action-button">
        <Fab
          size="small"
          className="sidedrawer__fab sidedrawer__fab--group"
          onClick={() => clearAfterSuccessPost()}
        >
          <Group className="sidedrawer__icon--group" />
        </Fab>
        <Fab
          size="small"
          className="sidedrawer__fab sidedrawer__fab--add"
          onClick={() => setSideDrawBD('add-group')}
        >
          <GroupAdd className="sidedrawer__icon--add" />
        </Fab>
      </div>
    </div>
  );

  let SideDrawBody;
  if (sideDrawBD === 'list-group') {
    SideDrawBody = (
      <div>
        {teamList ? (
          renderTeamList()
        ) : (
          <p style={{ textAlign: 'center' }}>No group</p>
        )}
      </div>
    );
  } else if (sideDrawBD === 'add-group') {
    SideDrawBody = (
      <div className="sidedrawer__body">
        <div className="sidedrawer__addgroup">
          <p className="p--add-new-group">Add New Group</p>
          <div className="sidedrawer__addgroup--groupname-box">
            <p className="p--input-topic">Group name</p>
            <Input
              className="group-input"
              onChange={(e) => {
                groupNameHandler(e);
              }}
            />
            <span hidden={GroupNameError} className="p--group-name-error">
              required
            </span>
          </div>
          <div className="sidedrawer__addgroup--teamname-box">
            <div className="sidedrawer__member">
              <p className="p--input-topic">Member</p>
              <div className="sidedrawer__member-addDel">
                <AddCircleOutline
                  className="sidedrawer__icon--addmember"
                  onClick={() => setInputN((state) => state + 1)}
                />
                <RemoveCircleOutline
                  className="sidedrawer__icon--delmember"
                  onClick={() => deleteMemberRow()}
                />
              </div>
            </div>
            <div>
              {AddMemberInput().map((el) => {
                return el;
              })}
            </div>
            <div className="sidedrawer__addgroup--submit">
              <p
                className="btn-groupmng btn-groupmng--cancel"
                onClick={() => clearAfterSuccessPost()}
              >
                CANCEL
              </p>
              <p
                className="btn-groupmng btn-groupmng--ok"
                onClick={() => {
                  summaryNewGroup();
                }}
              >
                DONE
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const SideDrawFooter = (
    <div className="sidedrawer__footer">
      <CloseRounded
        className="sidedrawer__icon--close"
        onClick={() => onCloseSideDraw()}
      />
    </div>
  );

  /**
  |--------------------------------------------------
  | RETURN 
  |--------------------------------------------------
  */
  return (
    <div>
      <Drawer
        title={SideDrawHeader}
        placement="left"
        closable={false}
        onClose={sdOnClose}
        visible={sdVisible}
        footer={SideDrawFooter}
        maskClosable={false}
        width="20%"
      >
        {SideDrawBody}
      </Drawer>
    </div>
  );
};

export default ManageGroup;
