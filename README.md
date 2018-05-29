<p align="center">
  <a href="https://upis.github.io">
    <img src="https://upis.github.io/assets/img/upis.png" alt="UpIs" width=150>
  </a>

  <p align="center">
    Upis enables you to quickly create GitLab and GitHub issues. Submit multiple issues to your git project! It's so easy...
    <br>
    <a href="https://upis.github.io/"><strong>See the project »</strong></a>
    <br>
    <br>
    ·
    <a href="https://github.com/upis/upis.github.io/issues/new">Report bug</a>
    ·
    <a href="https://github.com/upis/upis.github.io/issues/new?labels=feature">Request feature</a>
    ·
  </p>
</p>
<br>

### Use

You'll need to use our markup style but it's quite easy... So... use "- " for issue title, "> " for issue description and "# " for issue labels (multiple labels are separated by comma). Eg:

```
- As user I want to log in to the system
> The user will log in with email and password
# user,essential
- As user I want to edit my profile
> The user will upload profile picture and update personal data
# user,essential,file
```

This input will generate two issues:
- As user I want to log in to the system
  - The user will log in with email and password (description)
  - #user #essential (labels)
- As user I want to edit my profile
  - The user will upload profile picture and update personal data (description)
  - #user #essential #file (labels)

YYou can also use "$w " for issue weight (**GitLab ONLY**)

### The space after the character (-, >, # or $w) is required and the **order matters**!! Don't forget!

``` note
PS.: **Order: -, >, #, $w**. You may choose not to use all the options but you must respect the order.
```

``` note
We do not store any of your data! If you want to, check the code.
```

### Compatibility
 - GitLab
 - GitHub

### Author
[@jprodrigues70](https://github.com/jprodrigues70)

### Licence
[GNU General Public License v3.0.](https://choosealicense.com/licenses/gpl-3.0/)
