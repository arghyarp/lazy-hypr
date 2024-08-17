# Root password (leave blank to be prompted).
ROOT_PASSWORD='root'

# The main user's password (leave blank to be prompted).
USER_PASSWORD='root'

configure() {
    echo '-------------------------------------------------------------------'
    echo 'Installing additional packages'
    echo '-------------------------------------------------------------------'
    install_packages

    echo '-------------------------------------------------------------------'
    echo 'Installing AUR packages'
    echo '-------------------------------------------------------------------'
    install_aur_packages

    echo '-------------------------------------------------------------------'
    echo 'Clearing package tarballs'
    echo '-------------------------------------------------------------------'
    clean_packages

    echo '-------------------------------------------------------------------'
    echo 'Updating pkgfile database'
    echo '-------------------------------------------------------------------'
    update_pkgfile

    echo '-------------------------------------------------------------------'
    echo 'Building locate database'
    echo '-------------------------------------------------------------------'
    update_locate

    echo '-------------------------------------------------------------------'
    echo 'Setting initial daemons'
    echo '-------------------------------------------------------------------'
    set_daemons 
}

install_packages() {
    pacman -Sy --noconfirm $(cat ~/Personal/Github/lazy-hypr/packages)
}

install_aur_packages() {
    mkdir /foo
    export TMPDIR=/foo
    yay --answerdiff None --answerclean All -S $(cat ~/Personal/Github/lazy-hypr/aur-packages)
    unset TMPDIR
    rm -rf /foo
}

clean_packages() {
    yes | pacman -Scc
}

update_pkgfile() {
    pkgfile -u
}

set_daemons() {
    systemctl enable keyd.service
}

update_locate() {
    updatedb
}




configure
