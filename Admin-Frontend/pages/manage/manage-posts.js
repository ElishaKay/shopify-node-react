// import Link from 'next/link';
import { useState, useEffect } from 'react';
import Router from 'next/router';
import { getCookie, isAuth } from '../../actions/auth';
import { list, removeBlog, toggleBlogVisibility } from '../../actions/blog';
import moment from 'moment';
import {
  Button,
  ButtonGroup,
  Card,
  Form,
  FormLayout,
  Layout,
  Page,
  Stack,
  TextField,
  SettingToggle,
  TextStyle,
  Link,
  EmptyState,
  List
} from '@shopify/polaris';
import { TitleBar } from '@shopify/app-bridge-react';

const ManagePosts = (props) => {
    const img = 'https://cdn.shopify.com/s/files/1/0757/9955/files/empty-state.svg';
    const [blogs, setBlogs] = useState([]);
    const [loaded, setLoaded] = useState(false);
    const [message, setMessage] = useState('');
    const [toggleValue, setToggleValue] = useState(true);
    const token = getCookie('token');

    useEffect(() => {
        loadBlogs();
    }, []);

    const hideShowBlog = blog => {
       console.log('blog in hideShowBlog function', blog);

        toggleBlogVisibility(blog.slug, blog.shopifyDomain).then(data => {
            if (data.error) {
                console.log(data.error);
            } else {
                setMessage(data.message);
                console.log('data',data);
                loadBlogs();
            }
        });
    };

    const deleteBlog = blog => {
        removeBlog(blog.slug, blog.shopifyDomain).then(data => {
            if (data.error) {
                console.log(data.error);
            } else {
                setMessage(data.message);
                loadBlogs();
            }
        });
    };


    const loadBlogs = () => {
        list(props).then(data => {
            if (data.error) {
                console.log(data.error);
            } else {
                console.log('blog array after updating: ',data);
                setBlogs(data);
                setLoaded(true);
            }
        });
    };

    
    const deleteConfirm = blog => {
        let answer = window.confirm('Are you sure you want to delete this post?');
        if (answer) {
            deleteBlog(blog);
        }
    };

    const showAllBlogs = () => {
        // const contentStatus = enabled ? 'Disable' : 'Enable';
        // const textStatus = enabled ? 'enabled' : 'disabled';

        return loaded ? (
                <Layout.AnnotatedSection
                    title="Manage Posts"
                    description="Review new posts and set approved content live."
                  >
                 <TitleBar
                    primaryAction={{
                      content: 'View My Network',
                      url: 'https://'+ props.app.shopOrigin+ '/community/connect',
                      external: true
                    }}
                  />
                {blogs.map((blog, i) => {
                    return (
                      <SettingToggle
                          key={i}
                          action={{
                            content: blog.hidden ? 'Make Public': 'Make Hidden',
                            onAction: hideShowBlog.bind(null, blog)
                          }}
                          hidden={blog.hidden}
                        >
                          <h1><b>{blog.title}</b></h1>
                          <br/>
                          <p className="mark"> 
                              Written by <a target='_blank' href={`https://${blog.shopifyDomain}/community/connect/user/${blog.postedBy.username}`}>
                                {blog.postedBy.name}
                              </a>
                              {' '}| Published {moment(blog.updatedAt).fromNow()}
                          </p>
                          This post is{' '}
                          <TextStyle variation="strong">{blog.hidden ? 'hidden': 'public'}</TextStyle>.
                          <ButtonGroup segmented={true} fullWidth={false} connectedTop={true}>
                            <Button key={0} primary url={`/manage/blog/${blog.slug}`}>
                                     Edit   
                            </Button>
                            <Button key={1} onClick={() => deleteConfirm(blog)}>Delete</Button>
                          </ButtonGroup>
                      </SettingToggle>) })};
                 </Layout.AnnotatedSection>
           ) : ( <p>Loading...</p> )
    };

    return (
        <Page>
            <Layout>
              <TitleBar
                  primaryAction={{
                    content: 'View My Network',
                    url: 'https://'+ props.app.shopOrigin+ '/community/connect',
                    external: true
                  }}
                />
                {message && <div className="alert alert-warning">{message}</div>}

                {loaded && blogs.length==0
                    ? <EmptyState
                            heading="No New Posts Quite Yet"
                            image={img}
                          >
                           <p>We recommend the following checklist to help you get started:</p>
                           <br/>
                           <List type="number">
                              <List.Item>
                                Drive the conversation around specific topics by {' '}
                                <Button primary url={`/manage/manage-tags`}>
                                     Adding Topics   
                                </Button>
                              </List.Item>
                              <List.Item>Customize the Look & Feel of Your Network with {' '}
                                <Button primary url={`/settings`}>
                                     Custom Images and Colors   
                                </Button>
                              </List.Item>
                              <List.Item>Verify that within your {' '}
                                <Button external={true} primary url={`https://help.shopify.com/en/manual/checkout-settings/customer-accounts`}>
                                      Store Settings 
                                </Button> {' '}
                                Customer Accounts are either optional or required.
                              </List.Item>

                              <List.Item>Visit your Community Pages on {' '}
                                <Button external={true} primary url={`https://${props.app.shopOrigin}/community/connect`}>
                                      YourSite.com/community/connect
                                </Button> {' '}
                                and Create Some New Posts (you'll need a Customer Account if you don't have one yet).
                              </List.Item>
                              <List.Item>Invite Shoppers to read & create content (ideally, each time they make a purchase)</List.Item>
                            </List>
                      </EmptyState>
                    : showAllBlogs()
                }
            </Layout>
        </Page>
    );
};

export default ManagePosts;